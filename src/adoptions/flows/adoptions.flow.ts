import {
  StatusRequestAdoption,
  StatusResultAdoption,
} from '../models/adoption.status.model';

export const adoptionStatusRequestFlow: Record<
  StatusRequestAdoption,
  StatusRequestAdoption[]
> = {
  [StatusRequestAdoption.CREATED]: [
    StatusRequestAdoption.SUITABLE,
    StatusRequestAdoption.CANCELLED,
  ],
  [StatusRequestAdoption.SUITABLE]: [
    StatusRequestAdoption.SELECTED_ANIMAL,
    StatusRequestAdoption.CANCELLED,
  ],
  [StatusRequestAdoption.SELECTED_ANIMAL]: [
    StatusRequestAdoption.SELECTED_ANIMAL,
    StatusRequestAdoption.ADOPTION_COMPLETED,
  ],
  [StatusRequestAdoption.ADOPTION_COMPLETED]: [
    StatusRequestAdoption.ADOPTION_COMPLETED,
  ],
  [StatusRequestAdoption.CANCELLED]: [StatusRequestAdoption.CANCELLED],
};

export const adoptionStatusResultFlow: Record<
  StatusResultAdoption,
  StatusResultAdoption[]
> = {
  [StatusResultAdoption.NOT_EVALUATED]: [
    StatusResultAdoption.APPROVED,
    StatusResultAdoption.REJECTED,
    StatusResultAdoption.NOT_EVALUATED,
  ],
  [StatusResultAdoption.APPROVED]: [StatusResultAdoption.APPROVED],
  [StatusResultAdoption.REJECTED]: [StatusResultAdoption.REJECTED],
  [StatusResultAdoption.BANNED]: [StatusResultAdoption.BANNED],
};
