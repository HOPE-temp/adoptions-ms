import { StatusFollowupAdoptedAnimal } from '../models/followup.status.model';

export const followupStatusRequestFlow: Record<
  StatusFollowupAdoptedAnimal,
  StatusFollowupAdoptedAnimal[]
> = {
  [StatusFollowupAdoptedAnimal.SCHEDULED_FOLLOUP]: [
    StatusFollowupAdoptedAnimal.IN_FOLLOWUP,
  ],
  [StatusFollowupAdoptedAnimal.IN_FOLLOWUP]: [
    StatusFollowupAdoptedAnimal.SCHEDULED_FOLLOUP,
    StatusFollowupAdoptedAnimal.SCHEDULED_STERILIZATION,
    StatusFollowupAdoptedAnimal.VERIFIED,
    StatusFollowupAdoptedAnimal.CANCELLED,
  ],
  [StatusFollowupAdoptedAnimal.SCHEDULED_STERILIZATION]: [
    StatusFollowupAdoptedAnimal.VERIFIED,
    StatusFollowupAdoptedAnimal.IN_FOLLOWUP,
  ],
  [StatusFollowupAdoptedAnimal.VERIFIED]: [
    StatusFollowupAdoptedAnimal.VERIFIED,
  ],
  [StatusFollowupAdoptedAnimal.CANCELLED]: [
    StatusFollowupAdoptedAnimal.CANCELLED,
  ],
};
