/**
 * Determine if onboarding is complete
 * @param {object} profile
 * @param {Array<string>} myBubbles
 * @returns {boolean}
 */
export function isOnboardingComplete(profile, myBubbles = []) {
  return profile?.onboarding_complete || myBubbles.length > 0
}
