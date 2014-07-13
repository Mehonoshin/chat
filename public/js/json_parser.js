function JsonParser(data) {
  try {
    return JSON.parse(data);
  } catch (e) {
    console.log('This doesn\'t look like a valid JSON: ', message.data);
    return;
  }
}
