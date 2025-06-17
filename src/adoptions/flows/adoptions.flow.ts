import {
  StatusRequestApotion,
  StatusResultApotion,
} from '../models/adoption.status.model';

export const adoptionStatusRequestFlow: Record<
  StatusRequestApotion,
  StatusRequestApotion[]
> = {
  [StatusRequestApotion.CREATED]: [
    StatusRequestApotion.SUITABLE,
    StatusRequestApotion.CANCELLED,
  ],
  [StatusRequestApotion.SUITABLE]: [
    StatusRequestApotion.SELECTED_ANIMAL,
    StatusRequestApotion.CANCELLED,
  ],
  [StatusRequestApotion.SELECTED_ANIMAL]: [
    StatusRequestApotion.ADOPTION_COMPLETED,
  ],
  [StatusRequestApotion.ADOPTION_COMPLETED]: [
    StatusRequestApotion.ADOPTION_COMPLETED,
  ],
  [StatusRequestApotion.CANCELLED]: [StatusRequestApotion.CANCELLED],
};

export const adoptionStatusResultFlow: Record<
  StatusResultApotion,
  StatusResultApotion[]
> = {
  [StatusResultApotion.NOT_EVALUATED]: [
    StatusResultApotion.APPROVED,
    StatusResultApotion.REJECTED,
    StatusResultApotion.NOT_EVALUATED,
  ],
  [StatusResultApotion.APPROVED]: [StatusResultApotion.APPROVED],
  [StatusResultApotion.REJECTED]: [StatusResultApotion.REJECTED],
  [StatusResultApotion.BANNED]: [StatusResultApotion.BANNED],
};
