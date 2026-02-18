const axios = require("axios");

const BASE_URL = "https://api.fda.gov/drug/label.json";

async function searchDrugByName(drugName) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        search: `openfda.brand_name:"${drugName}"`,
        limit: 1
      }
    });

    const result = response.data.results[0];

    return {
      name: result.openfda?.brand_name?.[0] || drugName,
      purpose: result.purpose?.[0] || "Not available",
      indications: result.indications_and_usage?.[0] || "Not available",
      warnings: result.warnings?.[0] || "Not available"
    };
  } catch (error) {
    console.error("OpenFDA Error:", error.response?.data || error.message);
    throw new Error("Drug not found in OpenFDA");
  }
}

module.exports = { searchDrugByName };