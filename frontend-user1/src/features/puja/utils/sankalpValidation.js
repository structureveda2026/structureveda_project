/**
 * Business rule validation for Sankalp members.
 * 
 * Client Rule:
 * If Relationship = Daughter AND Marital Status = Married,
 * then the member is not eligible for this Family Sankalp.
 */
export const validateMemberEligibility = (member) => {
  if (!member) {
    return { isValid: true };
  }

  const relationship = (member.relationship || "").trim().toLowerCase();
  const maritalStatus = (member.maritalStatus || "").trim().toLowerCase();

  if (relationship === "daughter" && maritalStatus === "married") {
    return {
      isValid: false,
      message: "⚠ Married daughters are not eligible for this Family Sankalp as per Shastric tradition.",
    };
  }

  return { isValid: true };
};
