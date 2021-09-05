import { useRadio, Box, UseRadioProps, useRadioGroup, Flex, HTMLChakraProps } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Card } from "../../atoms/Card";
import { BaseFeeChart, ChartType } from "../../organisms/BaseFeeChart";
import { BlockStats } from "../../libs/ethereum";
import { Setting } from "../../config";
import { useSettings } from "../../contexts/SettingsContext";

interface RadioCardProps extends UseRadioProps {
  children?: React.ReactNode
  blocks?: BlockStats[]
}

function RadioCard(props: RadioCardProps) {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box as="label" fontSize={12} userSelect="none">
      <input {...input} style={{ display: "none" }} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="sm"
        boxShadow="md"
        variant="brandSecondary"
        textAlign="center"
        pt={1}
        pb={1}
        pr={2}
        pl={2}
        _checked={{
          bg: "brand.orange",
          color: "white",
          borderColor: "brand.orange",
        }}
        _focus={{
          boxShadow: "outline",
        }}
      >
        {props.children}
      </Box>
    </Box>
  )
}

export interface CardLiveProps extends HTMLChakraProps<"div"> {
  type: "primary" | "secondary"
  charts: ChartType[]
}

function settingType(type: string) {
  return type === "primary" ? Setting.chartType : Setting.chartSecondaryType
}

export function CardLiveChart(props: CardLiveProps) {
  const { type, charts, ...rest } = props
  const settings = useSettings();

  const [chartType, setChartType] = useState<ChartType>(
    settings.get(settingType(type))
  );

  useEffect(() => {
    if (charts.indexOf(chartType) === -1) {
      setChartType(charts[0]);
    }
  }, [charts, chartType]);

  useEffect(() => {
    settings.set(settingType(type), chartType);
  }, [settings, type, chartType]);

  const { getRadioProps } = useRadioGroup({
    name: "chart",
    value: chartType,
    onChange: (value: ChartType) => setChartType(value),
  })

  return (
    <Card
      title={type === "primary" ? "Live Issuance Chart" : "Live Fee Chart"}
      minH={400}
      h={{ base: "auto", md: 400 }}
      flexShrink={0}
      {...rest}
    >
      <Flex justifyContent={{ sm: "center", md: "flex-end" }} gridGap={2}>
        {charts.map((value) => {
          const radio = getRadioProps({ value })
          return (
            <RadioCard key={value} {...radio}>
              {value}
            </RadioCard>
          )
        })}
      </Flex>
      <BaseFeeChart chartType={chartType} />
    </Card>
  );
}
