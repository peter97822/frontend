import { useContext, createContext, useEffect } from "react"
import { Block, BlockStats, EthereumApi, useEthereum } from "./EthereumContext"
import { BigNumber, utils } from 'ethers'
import { useSetting } from "../hooks/useSetting";
import { Loader } from "../organisms/Loader";
import { useReducer } from "react";
import { Setting } from "../config";
import { BigNumberMax, BigNumberMin, Zero } from "../utils/number";

export interface BurnedBlockTransaction extends Block {
  burned: BigNumber
  rewards: BigNumber
  basefee: BigNumber
  gasTarget: BigNumber
}

export interface BlockExplorerSession {
  burned: BigNumber
  blockCount: number
  transactionCount: number
  rewards: BigNumber
  minBaseFee: BigNumber
  maxBaseFee: BigNumber
}

export interface BlockExplorerDetails {
  totalBurned: BigNumber
  gasPrice: BigNumber
  currentBlock: number
  currentBaseFee: BigNumber
}

type BlockExplorerContextType = {
  details?: BlockExplorerDetails,
  blocks?: BlockStats[]
  session?: BlockExplorerSession
}

interface NewBlockAction {
  type: 'NEW_BLOCK'
  details: BlockExplorerDetails
  block: BlockStats
  maxBlocksToRender: number
}

interface InitAction {
  type: 'INIT'
  details: BlockExplorerDetails
  blocks: BlockStats[]
}

type ActionType =
  | NewBlockAction
  | InitAction

const safeBurned = async (eth: EthereumApi, blockNumber: number, fetchTotal: boolean = false) => {
  if (eth.connectedNetwork.genesis > blockNumber) {
    return Zero()
  }

  const blockNumberInHex = utils.hexValue(blockNumber)

  if (fetchTotal) {
    return eth.debug_burned(utils.hexValue(eth.connectedNetwork.genesis), blockNumberInHex)
  }

  return eth.burned(blockNumberInHex, blockNumberInHex)
}

const safeTotalBurned = (eth: EthereumApi, blockNumber: number) => safeBurned(eth, blockNumber, true)

export const BlockExplorerApi = {
  fetchDetails: async (eth:  EthereumApi, block: BurnedBlockTransaction, skipTotalBurned = false): Promise<BlockExplorerDetails> => {
    const totalBurned = skipTotalBurned ? Zero() : await safeTotalBurned(eth, block.number)
    const gasPrice = await eth.getGasPrice()
    return {
      currentBlock: block.number,
      totalBurned,
      gasPrice,
      currentBaseFee: block.basefee
    }
  },
  fetchBlock: async (eth:  EthereumApi, blockNumber: number): Promise<BurnedBlockTransaction | undefined> => {
    const block = await eth.getBlock(blockNumber)
    if (block) {
      return BlockExplorerApi.fetchBlockExtra(eth, block)
    }

    return undefined
  },

  fetchBlockStats: async (eth:  EthereumApi, blockNumber: number): Promise<BlockStats | undefined> => {
    return eth.getBlockStats(blockNumber)
  },

  fetchBlockExtra: async (eth: EthereumApi, block: Block): Promise<BurnedBlockTransaction | undefined> => {
    const baseFeePerGas = block.baseFeePerGas
    const gasLimit = block.gasLimit
    
    const blockNumberInHex = utils.hexValue(block.number)
    const rewards = await eth.getBlockReward(blockNumberInHex)
    const basefee = baseFeePerGas
    const burned =  await safeBurned(eth, block.number)
    const gasTarget = gasLimit.div(2)

    return {
      ...block,
      number: block.number,
      transactions: block.transactions || [],
      baseFeePerGas: block.gasLimit,
      gasLimit: block.gasLimit,
      gasUsed: block.gasUsed,
      burned,
      rewards,
      basefee,
      gasTarget,
      difficulty: block.difficulty
    }
  }
}

const BlockExplorerContext = createContext<BlockExplorerContextType>({
  details: undefined,
  blocks: undefined
})
  
const useBlockExplorer = () => useContext(BlockExplorerContext);

const blockExplorerReducer = (state: BlockExplorerContextType, action: ActionType): BlockExplorerContextType => {
  switch (action.type) {
    case 'NEW_BLOCK': {
      if (!state.details || !action.block || !action.details || !state.session)
        return state
      
      let totalBurned = state.details.totalBurned
      if (!action.block.burned.isZero()) {
        totalBurned = action.block.burned.add(totalBurned)
        state.session.burned = state.session.burned.add(action.block.burned)
      }

      state.session.rewards = state.session.rewards.add(action.block.rewards)
      state.session.blockCount = state.session.blockCount + 1
      state.session.transactionCount = state.session.transactionCount + action.block.transactions

      const newState: BlockExplorerContextType  = {
        details: { ...action.details,  totalBurned },
        blocks: [action.block, ...((state.blocks || []).slice(0, action.maxBlocksToRender - 1))],
        session: state.session
      }

      return newState
    }
    case 'INIT': {
      const session: BlockExplorerSession = {
        blockCount: action.blocks.length,
        burned: Zero(),
        rewards: Zero(),
        transactionCount: 0,
        minBaseFee: BigNumber.from(Number.MAX_SAFE_INTEGER.toString()),
        maxBaseFee: BigNumber.from(Number.MIN_SAFE_INTEGER.toString()),
      }
      
      action.blocks.map(block => {
        const basefee = block.baseFee
        session.transactionCount += block.transactions
        session.burned = block.burned.add(session.burned)
        session.rewards = block.rewards.add(session.rewards)
        session.minBaseFee = BigNumberMin(basefee, session.minBaseFee)
        session.maxBaseFee = BigNumberMax(basefee, session.maxBaseFee)

        return block;
      })

      return { blocks: action.blocks, details: action.details, session }
    }
    default:
      return state
  }
}

const BlockExplorerProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const { eth } = useEthereum()
  const [state, dispatch] = useReducer(blockExplorerReducer, {})
  const maxBlocksToRender = useSetting<number>(Setting.maxBlocksToRender)

  useEffect(() => {
    if (!eth)
      return

    const onNewBlockHeader = async (block: BlockStats) => {
      // const blockWithExtras = await BlockExplorerApi.fetchBlockExtra(eth, block)
      // if (!blockWithExtras)
      //   return

      //const details = await BlockExplorerApi.fetchDetails(eth, blockWithExtras, true)

      dispatch({ 
        type: 'NEW_BLOCK', 
        details: {
          totalBurned: BigNumber.from(0),
          gasPrice: BigNumber.from(0),
          currentBlock: 0,
          currentBaseFee: BigNumber.from(0)
        }, 
        block, 
        maxBlocksToRender 
      })
    }

    const prefetchBlockHeaders = async (blockHeaderCount: number) => {
      const latestBlockNumber = (process.env.REACT_APP_START_BLOCK ? parseInt(process.env.REACT_APP_START_BLOCK) : await eth.getBlockNumber())

      const processedBlocks: BlockStats[] = []
      for (var i = 0; i < blockHeaderCount; i++) {
        const blockNumber = Math.max(0, latestBlockNumber - i)
        const block = await BlockExplorerApi.fetchBlockStats(eth, blockNumber)
        if (block)
          processedBlocks.push(block)
      }
      
      return processedBlocks
    }

    const init = async () => {
      const blocks = await prefetchBlockHeaders(10 /* Ease the server a bit so only 5 initial */)
      if (blocks.length) {
        // const details = await BlockExplorerApi.fetchDetails(eth, blocks[0])
        dispatch({ type: 'INIT', details: {
          totalBurned: BigNumber.from(0),
          gasPrice: BigNumber.from(0),
          currentBlock: 0,
          currentBaseFee: BigNumber.from(0)
        }, blocks })
      }
      eth.on('block', onNewBlockHeader)
    }

    init()
    
    return () => { eth.off('block', onNewBlockHeader) }
  }, [eth, maxBlocksToRender])

  return (
    <BlockExplorerContext.Provider
      value={state}>
      {state.blocks ? children : <Loader>retrieving latest blocks on {eth?.connectedNetwork.name}</Loader>}
    </BlockExplorerContext.Provider>
  )
}


export { useBlockExplorer, BlockExplorerProvider }
