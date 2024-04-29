const fromText = document.querySelector(".from-text");
const toText = document.querySelector(".to-text");
const exchageIcon = document.querySelector(".exchange");
const selectTag = document.querySelectorAll("select");
const icons = document.querySelectorAll(".row i");
const translateBtn = document.querySelector("button");

//Agrego la lista de paises en mi select tag
selectTag.forEach((tag, id) => {
  for (let country_code in countries) {
    let selected =
      id == 0
        ? country_code == "es-ES"
          ? "selected"
          : ""
        : country_code == "en-GB"
        ? "selected"
        : "";
    let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
    tag.insertAdjacentHTML("beforeend", option);
  }
});

//Funcion para que cuando haga click en el icono exchange, intercambiar los valores del lenguaje.
exchageIcon.addEventListener("click", () => {
  let tempText = fromText.value,
    tempLang = selectTag[0].value;
  fromText.value = toText.value;
  selectTag[0].value = selectTag[1].value;
  selectTag[1].value = tempLang;
});

//Sincronizacion de los campos de texto del from text al to text
fromText.addEventListener("keyup", () => {
  if (!fromText.value) {
    toText.value = "";
  }
});

//Funcion para que cuando haga click en el boton de traducir, se almacenen los datos y el placeholder cambie.
translateBtn.addEventListener("click", () => {
  let text = fromText.value.trim(),
    translateFrom = selectTag[0].value,
    translateTo = selectTag[1].value;
  if (!text) return; //Cuando en input esta vacio, si hago click, no hace nada. Si hay algo
  toText.setAttribute("placeholder", "translating...");

  //Agregamos la API para la traduccion
  let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      toText.value = data.responseData.translatedText;
      data.matches.forEach((data) => {
        if (data.id === 0) {
          toText.value = data.translation;
        }
      });
      toText.setAttribute("placeholder", "Translation");
    });
});

//Eventos de los iconos para copiar el texto y para escuchar el texto escrito
icons.forEach((icon) => {
  icon.addEventListener("click", ({ target }) => {
    if (!fromText.value || !toText.value) return;
    //Copiado en el portapapeles
    if (target.classList.contains("fa-copy")) {
      if (target.id == "from") {
        navigator.clipboard.writeText(fromText.value);
      } else {
        navigator.clipboard.writeText(toText.value);
      }
    } else {
      //Texto en altavoz
      let utterance;
      if (target.id == "from") {
        utterance = new SpeechSynthesisUtterance(fromText.value);
        utterance.lang = selectTag[0].value;
      } else {
        utterance = new SpeechSynthesisUtterance(toText.value);
        utterance.lang = selectTag[1].value;
      }
      speechSynthesis.speak(utterance);
    }
  });
});
