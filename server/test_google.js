import google from 'googlethis';

async function run() {
  try {
    const options = {
      page: 0, 
      safe: false,
      parse_ads: false,
      additional_params: { hl: 'en' }
    };
    const response = await google.search('what is neuron', options);
    console.log("Results count:", response.results.length);
    if (response.results.length > 0) {
      console.log(response.results.slice(0, 3).map(r => r.title + " - " + r.description).join("\n\n"));
    }
  } catch (err) {
    console.error("Error:", err);
  }
}
run();
