// Adjust config.json with OAuth credentials
const wdEdit = require("wikibase-edit")(require("./config.json"))

// Adjust entity for testing if necessary (default is Wikidata Sandbox)
const entity = "Q4115189"
// Adjust claim that will be created/updated/removed for testing if necessary
// (default is "Basisklassifikation")
const claimProperty = "P5748"
const claimValueCreate = "10"
const claimValueUpdate = "20"

runTest()

async function runTest() {

  console.log("- Attempting to create claim...")

  // 1. Create claim on entity
  let guid
  try {
    const addClaimResult = await wdEdit.claim.create({
      id: entity,
      property: claimProperty,
      value: claimValueCreate
    })
    guid = addClaimResult && addClaimResult.claim.id
  } catch(error) {
    console.error(error)
  }

  if (!guid) {
    // Doesn't make sense to continue
    console.error("Error when creating claim, please check OAuth credentials.")
    return
  }

  console.log("- Created claim with GUID:", guid)
  console.log()

  console.log("- Attempting to update claim (will fail)...")

  // 2. Update claim that was just created
  try {
    const updateClaimResult = await wdEdit.claim.update({ guid, newValue: claimValueUpdate })
    if (!updateClaimResult.success) {
      throw new Error("Updating claim was apparently not successful.")
    }
    console.log("- Updating claim was successful.")
  } catch(error) {
    console.error(error)
    console.error("- Updating claim failed with above error.")
  }

  console.log()

  console.log("- Attempting to delete claim (for cleanup)...")

  // 3. Delete claim again
  try {
    await wdEdit.claim.remove({ guid })
    console.log("- Deleting claim was successful.")
  } catch(error) {
    console.error(error)
    console.error("- Deleting claim failed with above error (please delete claim manually).")
  }

}
