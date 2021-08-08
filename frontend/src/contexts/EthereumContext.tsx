import React, { createContext, useContext, useEffect, useState } from 'react';
import LRU from 'lru-cache';
import { BigNumber, utils } from "ethers";
import { Ethereumish } from '../react-app-env';
import { defaultNetwork, EthereumNetwork } from '../config';
import { getNetworkFromSubdomain } from '../utils/subdomain';
import { Loader } from '../organisms/Loader';
import { EventEmitter } from '../utils/event';
import { HexToNumber, HexToBigNumber } from '../utils/number';

declare global {
  interface Window {
    ethereum: Ethereumish
  }
}

interface EthereumSyncing {
  currentBlock: number
  highestBlock: number
  startingBlock: number
  knownStates: number
  pulledStates: number
}

export enum WebSocketStatus {
  Connecting,
  Connected,
  Disconnected,
  Error,
}

interface AsyncMessage<T> {
  jsonrpc: "2.0"
  id?: number
  method?: string
  params?: {
    result: T,
    subscription: string
  }
  result?: string
}

export interface BlockStats {
  baseFee: BigNumber
  burned: BigNumber
  gasTarget: BigNumber
  gasUsed: BigNumber
  rewards: BigNumber
  tips: BigNumber
  number: number
  timestamp: number
  transactions: number
}

export interface BaseBlock {
  baseFeePerGas: BigNumber
  gasLimit: BigNumber
  gasUsed: BigNumber
  number: number
  size: number
  timestamp: number
  difficulty: number
  totalDifficulty: number
  extraData: string
  hash: string
  logsBloom: string
  miner: string
  mixHash: string
  nonce: string
  parentHash: string
  receiptsRoot: string
  sha3Uncles: string
  stateRoot: string
  transactionsRoot: string
}

export interface Block extends BaseBlock{
  transactions: string[]
}

export interface BlockWithTransactions extends BaseBlock {
  transactions: Transaction[];
}

export interface Transaction {
  blockHash: string
  from: string
  hash: string
  input: string
  r: string
  s: string
  to: string
  value: string
  nonce: number
  blockNumber: number
  transactionIndex: number
  type: number
  v: number
  gas: BigNumber
  gasPrice: BigNumber
  maxPriorityFeePerGas: BigNumber
  maxFeePerGas: BigNumber
  confirmations: number
}

export interface Totals {
  burned: BigNumber
  tipped: BigNumber
}

interface RetryAttempt {
  elapsed: number
  attempt: number
}

interface WebSocketEventMap {
  "status": WebSocketStatus
  "block": BlockStats
  "client": number
  "retryMaxAttemptsReached": boolean
  "retryStarting": void
  "retryAttempt": RetryAttempt
  "retrySuccess": RetryAttempt
}

interface WebSocketSubscriptionMap {
  channel: string
  event: keyof WebSocketEventMap
}

abstract class WebSocketRetry {
  private retry = 0;
  private startReconnectingTime = 0;

  constructor(private maxRetry: number) {}

  public attemptReconnect() {
    if (this.maxRetry <= this.retry) {
      console.info('[retry]', `Reached maximium retry attempts of ${this.maxRetry}, will not reconnect`);
      this.onRetryMaxAttemptsReached(this.maxRetry);
      return;
    }

    if (this.retry === 0) {
      console.info('[retry]', `Starting reconnection attempts`);
      this.onRetryStarting();
      this.startReconnectingTime = Date.now();
    }

    this.retry = this.retry + 1;
    const delayInSeconds = Math.max(Math.min(Math.pow(2, this.retry)
              + this.randInt(-this.retry, this.retry), 600), 1) + 3;

    console.info('[retry]', `Attempting to reconnect in ${delayInSeconds}s`);
    this.onRetryAttempt(delayInSeconds, this.retry);

    setTimeout(async () => await this.onRetry(), delayInSeconds  * 1000);
  }

  public recordSuccessfulConnection() {
    if (this.retry === 0)
      return;

    const ellapsedTimeInSeconds = (Date.now() - this.startReconnectingTime)  / 1000;
    console.info('[retry]', `Successfully reconnected in ${Math.floor(ellapsedTimeInSeconds)}s with ${this.retry === 1 ? 'a single attempt': `${this.retry} attempts`}`);
    this.onRetrySuccess(ellapsedTimeInSeconds, this.retry);

    this.retry = 0;
    this.startReconnectingTime = 0;
  }

  private randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  protected abstract onRetry(): Promise<void>;
  protected abstract onRetryMaxAttemptsReached(attempts: number): void;
  protected abstract onRetryStarting(): void;
  protected abstract onRetryAttempt(whenInSeconds: number, attempt: number): void;
  protected abstract onRetrySuccess(ellapsed: number, attempts: number): void;
}

class WebSocketProvider extends WebSocketRetry {
  private eventEmitter = EventEmitter<keyof WebSocketEventMap>()
  private connection: WebSocket;
  private asyncId: number = 0
  private promiseMap: {[key: number]: [ (value: any | PromiseLike<any>) => void, (e: unknown) => void]} = {}
  private cache = new LRU({
    max: 10000,
    maxAge: 1000 * 60 * 60  // 1 hour
  });
  private channelsToSubscribe: WebSocketSubscriptionMap[]  = [
    { channel: 'blockStats', event: 'block' },
    { channel: 'clientsCount', event: 'client' },
  ]
  private _status: WebSocketStatus = WebSocketStatus.Connecting
  private ethSubcribeMap: {[key: string]: keyof WebSocketEventMap} = {}  

  constructor(private url: string, maxRetry: number) {
    super(maxRetry);
    this.connection = new WebSocket(this.url);
  }

  public get ready(): Promise<void> {
    return this.connect()
  }

  public get status() {
    return this._status;
  }

  private set status(status: WebSocketStatus) {
    this._status = status;
  }

  protected onRetry(): Promise<void> {
    this.connection = new WebSocket(this.url);
    return this.connect()
  }

  protected onRetryMaxAttemptsReached(attempts: number) {
    this.eventEmitter.emit('retryMaxAttemptsReached', attempts);
  }

  protected onRetryStarting() {
    this.eventEmitter.emit('retryStarting', null);
  }

  protected onRetryAttempt(elapsed: number, attempt: number) {
    this.eventEmitter.emit('retryAttempt', { elapsed, attempt })
  }

  protected onRetrySuccess(elapsed: number, attempt: number) {
    this.eventEmitter.emit('retrySuccess', { elapsed, attempt })
  }

  private connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.addEventListener("close", () => {
        this.status = WebSocketStatus.Disconnected;
        this.eventEmitter.emit('status', this.status); 
        this.attemptReconnect();
      });

      this.connection.addEventListener("message", this.onMessage.bind(this));

      this.connection.addEventListener("open", () => {
        this.recordSuccessfulConnection();
        this.status = WebSocketStatus.Connected;
        this.eventEmitter.emit('status', this.status);

        // Make sure we get a registration callback from websocket that we are
        // indeed connected to these channels.
        const ensureChannelsSubscribed = this.channelsToSubscribe.map(sub => (
          new Promise<[keyof WebSocketEventMap, string]>((resolve, reject) => {
            this.send("eth_subscribe", [sub.channel]).then((data) => {
              resolve([sub.event, data as string])
            }).catch(e => reject(e))
          })
        ))

        Promise.all(ensureChannelsSubscribed).then((results) => {
          results.forEach(([name, id] ) => {
            this.ethSubcribeMap[id] = name
          })
          resolve()
        }).catch(e => reject(e))
      });

      this.connection.addEventListener("error", (e) => {
        this.status = WebSocketStatus.Error;
        this.eventEmitter.emit('status', this.status);
        reject(e)
      });
    })
  }

  protected async send<T extends {}>(method: string, params: any[]): Promise<T> {
    const id = this.getNextAsyncId();
    return new Promise((resolve, reject) => {
      this.promiseMap[id] = [resolve, reject]
      this.connection.send(JSON.stringify({
        id,
        jsonrpc: "2.0",
        method,
        params
      }))
    })
  }
  
  protected async cachedExecutor<T>(key: string, callback: () => Promise<T>, maxAge?: number): Promise<T> {
    if (this.cache.has(key)) {
      return this.cache.get(key) as T
    }
    const result = await callback()
    this.cache.set(key, result, maxAge)
    return result
  }

  private getNextAsyncId(): number {
    return ++this.asyncId;
  }

  public disconnect(): void {
    this.connection.close();
  }

  public on<K extends keyof WebSocketEventMap>(type: K, listener: (ev: WebSocketEventMap[K]) => void) {
    this.eventEmitter.on(type, listener);
  }

  public off<K extends keyof WebSocketEventMap>(type: K, listener: (ev: WebSocketEventMap[K]) => void) {
    this.eventEmitter.off(type, listener);
  }

  public onMessage(evt: MessageEvent) {
    // Sometimes messages come in multiple pairs to detect it.
    if (evt.data.indexOf('\n') !== -1) {
      const numberOfMessages = evt.data.split('\n')
      numberOfMessages.forEach((message: string) => this.processMessage(message))
    } else {
      this.processMessage(evt.data as string);
    }
  }

  private processMessage(message: string): void {
    let eventData: AsyncMessage<{}>
    try {
      eventData = JSON.parse(message) as AsyncMessage<{}>
    }
    catch (e) {
      console.error(`Please report to developer: "${message}"`)
      return
    }

    if (eventData.id) {
      const [resolve, ] = this.promiseMap[eventData.id]
      resolve(eventData.result !== undefined ? eventData.result : eventData.params?.result)
      delete this.promiseMap[eventData.id]
    } else if (eventData.method === 'eth_subscription') {
      if (!eventData.params) {
        console.error('Something went wrong with receiving the message from server');
        return;
      }
      const subscribedEvent = this.ethSubcribeMap[eventData.params.subscription];
      if (subscribedEvent) {
        this.eventEmitter.emit(subscribedEvent, eventData.params.result)
      }
      else {
        console.error('unknown event', eventData.params)
      }
    }
  }
}

class EthereumApiFormatters {
  static FormatTransaction(t: Transaction): Transaction {
    t.nonce = HexToNumber(t.nonce)
    t.blockNumber = HexToNumber(t.blockNumber)
    t.transactionIndex = HexToNumber(t.transactionIndex)
    t.type = HexToNumber(t.type)
    t.v = HexToNumber(t.v)
    t.gas = HexToBigNumber(t.gas)
    t.gasPrice = HexToBigNumber(t.gasPrice)
    t.maxPriorityFeePerGas = HexToBigNumber(t.maxPriorityFeePerGas)
    t.maxFeePerGas = HexToBigNumber(t.maxFeePerGas)
    t.confirmations = 0
    return t
  }

  static FormatBlock(b: BaseBlock): BaseBlock {
    b.baseFeePerGas = HexToBigNumber(b.baseFeePerGas)
    b.gasLimit = HexToBigNumber(b.gasLimit)
    b.gasUsed = HexToBigNumber(b.gasUsed)
    b.number = HexToNumber(b.number)
    b.size = HexToNumber(b.size)
    b.timestamp = HexToNumber(b.timestamp)
    b.difficulty = HexToNumber(b.difficulty)
    b.totalDifficulty = HexToNumber(b.totalDifficulty)
    return b
  }

  static FormatBlockStats(b: BlockStats): BlockStats | undefined {
    if (!b) return undefined;
    b.baseFee = HexToBigNumber(b.baseFee)
    b.burned = HexToBigNumber(b.burned)
    b.gasTarget = HexToBigNumber(b.gasTarget)
    b.gasUsed = HexToBigNumber(b.gasUsed)
    b.rewards = HexToBigNumber(b.rewards)
    b.tips = HexToBigNumber(b.tips)
    b.number = HexToNumber(b.number)
    b.timestamp = HexToNumber(b.timestamp)
    b.transactions = HexToNumber(b.transactions)
    return b
  }

  static FormatBlockWithTransactions(b: BlockWithTransactions): BlockWithTransactions {
    b = EthereumApiFormatters.FormatBlock(b) as BlockWithTransactions
    b.transactions = (b.transactions || []).map(EthereumApiFormatters.FormatTransaction)
    return b
  }

  static FormatSync(s: EthereumSyncing | boolean): EthereumSyncing | boolean {
    if (s !==  false) {
      s = s as EthereumSyncing
      s.currentBlock = HexToNumber(s.currentBlock)
      s.highestBlock = HexToNumber(s.highestBlock)
      s.startingBlock = HexToNumber(s.startingBlock)
      s.knownStates = HexToNumber(s.startingBlock)
      s.pulledStates = HexToNumber(s.startingBlock)
      return s
    }

    return false
  }

  static FormatTotals(s: Totals): Totals {
    s.burned = HexToBigNumber(s.burned)
    s.tipped = HexToBigNumber(s.tipped)
    return s
  }
}

export class EthereumApi extends WebSocketProvider {
  constructor(public connectedNetwork: EthereumNetwork, url: string, maxReconnectionAttempts: number) {
    super(url, maxReconnectionAttempts)
  }

  public async isSyncing(): Promise<EthereumSyncing | boolean> {
    return EthereumApiFormatters.FormatSync(await this.send('eth_syncing', []))
  }
  
  public async getTotals(): Promise<Totals> {
    const key = `${this.connectedNetwork.chainId}getTotals()`
    const result = await this.cachedExecutor<Totals>(key, () => this.send('internal_getTotals', []))
    return EthereumApiFormatters.FormatTotals(result)
  }

  public async getBlockNumber(): Promise<number> {
    const key = `${this.connectedNetwork.chainId}getBlockNumber()`
    const result = await this.cachedExecutor(key, () => this.send('eth_blockNumber', []), 10000)
    return HexToNumber(result);
  }
  
  public async getBlock(blockNumber: number): Promise<Block> {
    if (blockNumber < 0)
      throw Error(`Invalid block of negative value ${blockNumber}`)

    const blockNumberInHex = utils.hexValue(blockNumber)
    const key = `${this.connectedNetwork.chainId}getBlock(${blockNumberInHex})`
    const result = await this.cachedExecutor<Block>(key, () => this.send('eth_getBlockByNumber', [blockNumberInHex, false]))
    return EthereumApiFormatters.FormatBlock(result) as Block
  }

  public async getBlockStats(blockNumber: number): Promise<BlockStats | undefined> {
    if (blockNumber < 0)
      throw Error(`Invalid block of negative value ${blockNumber}`)

    const blockNumberInHex = utils.hexValue(blockNumber)
    const key = `${this.connectedNetwork.chainId}getBlockStats(${blockNumberInHex})`
    const result = await this.cachedExecutor<BlockStats>(key, () => this.send('internal_getBlockStats', [blockNumberInHex]))
    return EthereumApiFormatters.FormatBlockStats(result)
  }

  public async getBlockWithTransactions(blockNumber: number): Promise<BlockWithTransactions> {
    const blockNumberInHex = utils.hexValue(blockNumber)
    const key = `${this.connectedNetwork.chainId}getBlock(${blockNumber})`
    const result = await this.cachedExecutor<BlockWithTransactions>(key, () => this.send('eth_getBlockByNumber', [blockNumberInHex, true]))
    return EthereumApiFormatters.FormatBlockWithTransactions(result)
  }

  public async getBalance(address: string): Promise<BigNumber> {
    const key = `${this.connectedNetwork.chainId}getBalance(${address})`
    const result = await this.cachedExecutor(key, () => this.send('eth_getBalance', [address, 'latest']), 10000)
    return HexToBigNumber(result)
  }

  public async getTransaction(hash: string): Promise<Transaction> {
    const key = `${this.connectedNetwork.chainId}getTransaction(${hash})`
    const result = await this.cachedExecutor<Transaction>(key, () => this.send('eth_getTransactionByHash', [hash]))
    return EthereumApiFormatters.FormatTransaction(result);
  }
} 

type EthereumContextType = {
  eth?: EthereumApi,
}

const EthereumContext = createContext<EthereumContextType>({
  eth: undefined,
})

const useEthereum = () => useContext(EthereumContext);

const EthereumProvider = ({
  children,
  url,
  maxReconnectionAttempts,
}: {
  children: React.ReactNode
  url: string | undefined,
  maxReconnectionAttempts: number
}) => {
  const [eth, setEth] = useState<EthereumApi | undefined>()
  const [message, setMessage] = useState<string>('connecting to eth node')

  useEffect(() => {
    if (!url)
      return;

    const network = getNetworkFromSubdomain() || defaultNetwork
    const ethereum = new EthereumApi(network, url, maxReconnectionAttempts)
    setMessage(`connecting to ${network.key}, please wait`)

    const checkStatus = async () => {
      let syncStatus = await ethereum.isSyncing()
      if (syncStatus !==  false) {
        syncStatus = syncStatus as EthereumSyncing
        const currentBlock = syncStatus.currentBlock
        const highestBlock = syncStatus.highestBlock
        const percentage = Math.floor((currentBlock / highestBlock) * 100)
        if (percentage === 99) {
          setMessage(`${network.name} is not ready, state healing in progress.`)
        } else {
          setMessage(`${network.name} is not ready, node is syncing. ${percentage}% synced.`)
        }
        return false
      }
    
      setEth(ethereum)
      return true
    }

    let timer: number;
    ethereum.ready.then(async () => {
      if (!(await checkStatus())) {
        timer = window.setInterval(async () => {
          const status = await checkStatus()
          if (status) {
            clearInterval(timer)
          }
        }, 12000)
      }
    })
    return () => { 
      clearInterval(timer);
      ethereum.disconnect();
    }
  }, [url, maxReconnectionAttempts])

  return (
    <EthereumContext.Provider
      value={{
        eth,
      }}
    >
      {eth ? children : <Loader>{message}</Loader>}
    </EthereumContext.Provider>
  )
}

export { useEthereum, EthereumProvider }
