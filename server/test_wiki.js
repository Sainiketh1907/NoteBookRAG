async function run() {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent('what is neuron')}&utf8=&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.query && data.query.search) {
      console.log(data.query.search.slice(0, 3).map(r => r.title + " - " + r.snippet.replace(/<[^>]+>/g, '')).join("\n\n"));
    }
  } catch (err) {
    console.error("Error:", err);
  }
}
run();
