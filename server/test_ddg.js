import { search } from 'duck-duck-scrape';

async function run() {
  try {
    const response = await search('what is neuron');
    console.log("Results count:", response.results.length);
    if (response.results.length > 0) {
      console.log(response.results.slice(0, 3).map(r => r.title + " - " + r.description).join("\n\n"));
    }
  } catch (err) {
    console.error("Error:", err);
  }
}
run();
