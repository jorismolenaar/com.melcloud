import {
  type ConvertFromDevice,
  type ConvertToDevice,
  type OpCapabilities,
  OperationModeStateHotWaterCapability,
  OperationModeStateZoneCapability,
  type OperationModeZoneCapabilities,
  type ReportPlanParameters,
  type SetCapabilities,
  type SetCapabilitiesExtended,
  type Store,
  type TargetTemperatureFlowCapabilities,
} from '../../types'
import {
  type DeviceData,
  type ListDevice,
  OperationModeState,
  OperationModeZone,
} from '../../melcloud/types'
import BaseMELCloudDevice from '../../bases/device'
import { DateTime } from 'luxon'
import { K_MULTIPLIER } from '../../constants'

const HEAT_COOL_GAP: number = OperationModeZone.room_cool
const ROOM_FLOW_GAP: number = OperationModeZone.flow

const convertToDeviceMeasurePower: ConvertFromDevice<'Atw'> = ((
  value: number,
) => value * K_MULTIPLIER) as ConvertFromDevice<'Atw'>

const convertToDeviceOperationZone: ConvertFromDevice<'Atw'> = ((
  value: OperationModeZone,
) => OperationModeZone[value]) as ConvertFromDevice<'Atw'>

export = class AtwDevice extends BaseMELCloudDevice<'Atw'> {
  protected readonly fromDevice: Partial<
    Record<keyof OpCapabilities['Atw'], ConvertFromDevice<'Atw'>>
  > = {
    'alarm_generic.defrost': ((value: number) =>
      Boolean(value)) as ConvertFromDevice<'Atw'>,
    legionella: ((value: string) =>
      DateTime.fromISO(value, {
        locale: this.homey.i18n.getLanguage(),
      }).toLocaleString({
        day: 'numeric',
        month: 'short',
        weekday: 'short',
      })) as ConvertFromDevice<'Atw'>,
    measure_power: convertToDeviceMeasurePower,
    'measure_power.produced': convertToDeviceMeasurePower,
    operation_mode_state: ((value: OperationModeState) =>
      OperationModeState[value]) as ConvertFromDevice<'Atw'>,
    operation_mode_zone: convertToDeviceOperationZone,
    'operation_mode_zone.zone2': convertToDeviceOperationZone,
    operation_mode_zone_with_cool: convertToDeviceOperationZone,
    'operation_mode_zone_with_cool.zone2': convertToDeviceOperationZone,
    'target_temperature.flow_cool': this.#convertToDeviceTargetTemperatureFlow(
      'target_temperature.flow_cool',
    ),
    'target_temperature.flow_cool_zone2':
      this.#convertToDeviceTargetTemperatureFlow(
        'target_temperature.flow_cool_zone2',
      ),
    'target_temperature.flow_heat': this.#convertToDeviceTargetTemperatureFlow(
      'target_temperature.flow_heat',
    ),
    'target_temperature.flow_heat_zone2':
      this.#convertToDeviceTargetTemperatureFlow(
        'target_temperature.flow_heat_zone2',
      ),
  }

  protected readonly reportPlanParameters: ReportPlanParameters = {
    duration: { days: 1 },
    interval: { days: 1 },
    minus: { days: 1 },
    values: { hour: 1, millisecond: 0, minute: 10, second: 0 },
  }

  protected readonly toDevice: Partial<
    Record<keyof SetCapabilities['Atw'], ConvertToDevice<'Atw'>>
  > = {
    operation_mode_zone: ((value: keyof typeof OperationModeZone) =>
      OperationModeZone[value]) as ConvertToDevice<'Atw'>,
    'operation_mode_zone.zone2': ((value: keyof typeof OperationModeZone) =>
      OperationModeZone[value]) as ConvertToDevice<'Atw'>,
    operation_mode_zone_with_cool: ((value: keyof typeof OperationModeZone) =>
      OperationModeZone[value]) as ConvertToDevice<'Atw'>,
    'operation_mode_zone_with_cool.zone2': ((
      value: keyof typeof OperationModeZone,
    ) => OperationModeZone[value]) as ConvertToDevice<'Atw'>,
  }

  protected onCapability<K extends keyof SetCapabilitiesExtended['Atw']>(
    capability: K,
    value: SetCapabilitiesExtended['Atw'][K],
  ): void {
    if (capability.startsWith('operation_mode_zone')) {
      this.setDiff(capability, value)
      this.#handleOtherOperationModeZone(
        capability as keyof OperationModeZoneCapabilities,
        value as keyof typeof OperationModeZone,
      )
    } else {
      super.onCapability(capability, value)
    }
  }

  protected async updateCapabilities(
    data: DeviceData['Atw'] | ListDevice['Atw']['Device'] | null,
  ): Promise<void> {
    await super.updateCapabilities(data)
    if (data) {
      await this.#updateOperationModeStates()
    }
  }

  #convertToDeviceTargetTemperatureFlow(
    capability: keyof TargetTemperatureFlowCapabilities,
  ): ConvertFromDevice<'Atw'> {
    return ((value: number) =>
      value ||
      this.getCapabilityOptions(capability).min) as ConvertFromDevice<'Atw'>
  }

  #getOtherZoneValue(
    otherZoneCapability: keyof OperationModeZoneCapabilities,
    zoneValue: OperationModeZone,
    canCool: boolean,
  ): OperationModeZone {
    let otherZoneValue: OperationModeZone =
      OperationModeZone[this.getRequestedOrCurrentValue(otherZoneCapability)]
    if (canCool) {
      if (zoneValue > OperationModeZone.curve) {
        otherZoneValue =
          otherZoneValue === OperationModeZone.curve
            ? HEAT_COOL_GAP
            : otherZoneValue + HEAT_COOL_GAP
      } else if (otherZoneValue > OperationModeZone.curve) {
        otherZoneValue -= HEAT_COOL_GAP
      }
    }
    if (
      [OperationModeZone.room, OperationModeZone.room_cool].includes(
        zoneValue,
      ) &&
      otherZoneValue === zoneValue
    ) {
      otherZoneValue += ROOM_FLOW_GAP
    }
    return otherZoneValue
  }

  #handleOtherOperationModeZone<K extends keyof OperationModeZoneCapabilities>(
    capability: K,
    value: keyof typeof OperationModeZone,
  ): void {
    const { canCool, hasZone2 } = this.getStore() as Store['Atw']
    if (hasZone2) {
      const zoneValue: OperationModeZone = OperationModeZone[value]
      const otherZoneCapability: keyof OperationModeZoneCapabilities = (
        capability.endsWith('.zone2')
          ? capability.replace(/.zone2$/u, '')
          : `${capability}.zone2`
      ) as keyof OperationModeZoneCapabilities
      const otherZoneValue: OperationModeZone = this.#getOtherZoneValue(
        otherZoneCapability,
        zoneValue,
        canCool,
      )
      this.setDiff(
        otherZoneCapability,
        OperationModeZone[otherZoneValue] as keyof typeof OperationModeZone,
      )
    }
  }

  async #updateOperationModeStateHotWater(
    operationModeState: keyof typeof OperationModeState,
  ): Promise<void> {
    let value: OperationModeStateHotWaterCapability =
      OperationModeStateHotWaterCapability.idle
    if (this.getCapabilityValue('boolean.prohibit_hot_water')) {
      value = OperationModeStateHotWaterCapability.prohibited
    } else if (operationModeState in OperationModeStateHotWaterCapability) {
      value =
        OperationModeStateHotWaterCapability[
          operationModeState as OperationModeStateHotWaterCapability
        ]
    }
    await this.setCapabilityValue('operation_mode_state.hot_water', value)
  }

  async #updateOperationModeStates(): Promise<void> {
    const operationModeState: keyof typeof OperationModeState =
      this.getCapabilityValue('operation_mode_state')
    await this.#updateOperationModeStateHotWater(operationModeState)
    await Promise.all(
      ['zone1', 'zone2'].map(async (zone: string): Promise<void> => {
        await this.#updateOperationModeStateZone(
          operationModeState,
          zone as 'zone1' | 'zone2',
        )
      }),
    )
  }

  async #updateOperationModeStateZone(
    operationModeState: keyof typeof OperationModeState,
    zone: 'zone1' | 'zone2',
  ): Promise<void> {
    if (this.hasCapability(`operation_mode_state.${zone}`)) {
      let value: OperationModeStateZoneCapability =
        OperationModeStateZoneCapability.idle
      if (
        (this.getCapabilityValue(`boolean.prohibit_cooling_${zone}`) &&
          operationModeState === OperationModeStateZoneCapability.cooling) ||
        (this.getCapabilityValue(`boolean.prohibit_heating_${zone}`) &&
          operationModeState === OperationModeStateZoneCapability.heating)
      ) {
        value = OperationModeStateZoneCapability.prohibited
      } else if (
        operationModeState in OperationModeStateZoneCapability &&
        !this.getCapabilityValue(`boolean.idle_${zone}`)
      ) {
        value =
          OperationModeStateZoneCapability[
            operationModeState as OperationModeStateZoneCapability
          ]
      }
      await this.setCapabilityValue(`operation_mode_state.${zone}`, value)
    }
  }
}
