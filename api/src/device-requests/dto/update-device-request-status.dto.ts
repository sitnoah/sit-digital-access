import { IsEnum } from "class-validator";
import { DeviceRequestStatus } from "../device-request.enums";

export class UpdateDeviceRequestStatusDto {
  @IsEnum(DeviceRequestStatus)
  status: DeviceRequestStatus;
}
