import { StatusFollowupAdoptedAnimal } from '../models/followup.status.model';

export const followupStatusRequestFlow: Record<
  StatusFollowupAdoptedAnimal,
  StatusFollowupAdoptedAnimal[]
> = {
  [StatusFollowupAdoptedAnimal.SCHEDULED_FOLLOUP]: [
    StatusFollowupAdoptedAnimal.SCHEDULED_FOLLOUP,
    StatusFollowupAdoptedAnimal.SCHEDULED_STERILIZATION,
    StatusFollowupAdoptedAnimal.VERIFIED,
    StatusFollowupAdoptedAnimal.CANCELLED,
  ],
  [StatusFollowupAdoptedAnimal.SCHEDULED_STERILIZATION]: [
    StatusFollowupAdoptedAnimal.VERIFIED,
    StatusFollowupAdoptedAnimal.SCHEDULED_FOLLOUP,
  ],
  [StatusFollowupAdoptedAnimal.VERIFIED]: [
    StatusFollowupAdoptedAnimal.VERIFIED,
  ],
  [StatusFollowupAdoptedAnimal.CANCELLED]: [
    StatusFollowupAdoptedAnimal.CANCELLED,
  ],
};
