const generateMinutes = async (dataAudio) => {
    let dataFactory = [];
    let actualMinute = 1;
    let initialSecond = 60000;
  
    await dataAudio.forEach((item) => {
      while (item.start > initialSecond) {
        initialSecond += 60000;
        actualMinute += 1;
      }
  
      let existingEntry = dataFactory.find(df => df.minute === actualMinute);
      if (existingEntry) {
        existingEntry.text += " " + item.text;
      } else {
        dataFactory.push({
          minute: actualMinute,
          text: item.text
        });
      }
    });
    
    return dataFactory;
}

module.exports = {
    generateMinutes
}