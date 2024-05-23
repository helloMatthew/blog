document.addEventListener('DOMContentLoaded', function () {
  // const searchInput = document.getElementById('searchInput');
  const displayElement = document.getElementById("resultsContainer");
  const numArticlesLoaded = 3;
  let content = '';
  let data = [];
  let start = 0;
  let end = numArticlesLoaded;
  const peek = 0.5; // Observe when at least 50% of item in viewport
  const chunkDelay = 1000; // (1 second) delay between chunks



async function fetchData() {
  try {
    const response = await fetch('data.json');
    data = await response.json();
    // sort data in recent date order and slice for lazy load
    let orderedDate = (dateString) => new Date(dateString);
    return data.sort((a, b) => orderedDate(b.date) - orderedDate(a.date));
  } catch (error) {
    console.error('Error fetching data:', error)
  }
} 


// lazy load
// const observer = new IntersectionObserver(entries => {
//   entries.forEach(entry => {
//     if (entry.isIntersecting || entry.intersectionRatio > 0) {
//       loadNextChunk();
//     }
//   });
// }, { threshold: peek });

fetchData().then(data => {
  buildCardElements(data);
})

//   const lastItem = document.querySelector('.item:last-child');
//   observer.observe(lastItem);
// });


// function loadNextChunk() {
//   start += numArticlesLoaded;
//   end += numArticlesLoaded;
//   setTimeout(() => {
//     fetchData().then(data => {
//       if (data.length > 0) {

//         buildCardElements(data);

//         const lastItem = document.querySelector('.item:last-child');
//         observer.observe(lastItem);
//       } else {

//         observer.disconnect();
//       }
//     });
//   }, chunkDelay);
// }




// add https and filter out alternative prefixes
function addHttps(x) {
  if (!x.includes("http://") && !x.includes("https://")) {
    return `https://${x}`;
  } else {
    return x.replace(/^http:\/\//, 'https://');
  }
}

// compile the card UI with data
function buildCardElements (data) {
  displayElement.innerHTML = '';

  if (data.length === 0) {
    displayElement.innerHTML = '<p class="noresults">No results found.</p>';
  } 
  else {
    data.forEach((result, index) => {
      const { date, authorLink, authorName, image, title, para, paraLink, paraLinkWord, highlightWords } = result;
      const dateHtml = date ? `<h3>${date}</h3>` : '';
      const titleHtml = title ? title : '';

      const authorLinkUrlHtml = authorLink ? addHttps(authorLink) : '';
      const authorNameHtml = authorName ? authorName : '';
      const truncatedLinkText = authorNameHtml.length > 20 ? authorNameHtml.slice(0, 20) + '...' : authorNameHtml;

      const paraHtml = para ? para : '';
      const highlightWordsHtml = highlightWords ? highlightWords : '';

      const paraLinkWordHtml = paraLinkWord ? paraLinkWord : '';
      const paraLinkUrlHtml = paraLink ? addHttps(paraLink) : '';

      let paraSpan = paraHtml;

      if (paraHtml && (highlightWordsHtml || paraLinkWordHtml)) {
        const wordsArray = (highlightWordsHtml + ' ' + paraLinkWordHtml).split(/\s+/);
        wordsArray.forEach(word => {
          if (word && paraSpan.includes(word)) {
            if (word === paraLinkWordHtml) {
              const ctaHtml = ` <a class="paraLinkWordCol" href="${paraLinkUrlHtml}" target="_blank">${word}</a>`;
              paraSpan = paraSpan.replace(new RegExp(word, 'ig'), ctaHtml);
            } else {
              const ctaHtml = ` <span class="highlight">${word}</span>`;
              paraSpan = paraSpan.replace(new RegExp(word, 'ig'), ctaHtml);
            }
          }
        });
      }
      paraSpan = paraSpan || paraHtml;

      const hasImage = image ? `<img src="${image}" alt="${titleHtml}" />` : "";

      const hasAuthor = authorLinkUrlHtml && `<a class="authorLink" href="${authorLinkUrlHtml}" target="_blank">@${truncatedLinkText}</a>`;

      // item class is used as a 'hook' but has no style attributes
      content += `<div class="outer item">
        <div class="content">
          <div class="data">
            
            <div class="date-title">
              ${dateHtml}
              <h2 class="title">${titleHtml}</h2>
            </div>
            
            ${hasImage}
            <p class="paraBg">${paraSpan}</p>

            <div class="link">
              ${hasAuthor}
            </div>
          </div>
        </div>
      </div>`;
    });
  
  displayElement.insertAdjacentHTML('beforeend', content)
  }
  
  applyTheme(isDarkTheme);
};

    // searchInput.addEventListener('input', () => {
    //   const searchTerm = searchInput.value.toLowerCase();
    //   const results = data.filter(item => {
    //     return (
    //       item.date.toLowerCase().includes(searchTerm) ||
    //       item.authorLink.toLowerCase().includes(searchTerm) ||
    //       item.authorName.toLowerCase().includes(searchTerm) ||
    //       item.title.toLowerCase().includes(searchTerm) ||
    //       item.para.toLowerCase().includes(searchTerm) ||
    //       item.paraLink.toLowerCase().includes(searchTerm) ||
    //       item.paraLinkWord.toLowerCase().includes(searchTerm) ||
    //       item.highlightWords.toLowerCase().includes(searchTerm)
    //     );
    //   });
    //   buildCardElements(results);
    // });
  

  // 
  // 
  // 
  // 

  // change background page colour
  let isDarkTheme = false;
  let isUserToggled = false; // variable to track manual theme toggle
  let themeInterval; // variable to store the interval
  
  const body = document.body;
  const themeBtn = document.getElementById('theme');
  const logo = document.getElementById('logo');
  const logoSpan = document.getElementById('hyper');
  const outerElements = document.getElementsByClassName('outer');
  const contentElements = document.getElementsByClassName('content');
  const dataElements = document.getElementsByClassName('data');
  const paraBgEl = document.getElementsByClassName('paraBg');
  const spanHighightElements = document.getElementsByClassName('highlight');
  const paraLinkWordColEl = document.getElementsByClassName('paraLinkWordCol');
  const h2TitleElements = document.getElementsByClassName('title');
  const authorLinkElement = document.getElementsByClassName('authorLink');

  themeBtn.addEventListener("click", () => {
    isUserToggled = true; // user toggled the theme manually

    isDarkTheme = !isDarkTheme;
    applyTheme(isDarkTheme);

    // clear the interval if it was previously set
    if (themeInterval) {
      clearInterval(themeInterval);
      themeInterval = undefined;
    }
  });

  const darkThemeBg = "#212124";
  // const darkThemeBg = "#2f323e";
  const darkThemeBlend = "rgba(0, 0, 0, .1)";
  
  const lightThemeBg = "#f1f1e9";
  const lightThemeBlend = "#f1f1e9";
  
  const yellowHighlightBg = "#ffff0055";
  
  function applyTheme(isDarkTheme){
    body.style.backgroundColor = isDarkTheme ? lightThemeBg : darkThemeBg;

    const minLength = Math.max(outerElements.length, contentElements.length, spanHighightElements.length);

    for (let i = 0; i < minLength; i++) {
      const outer = outerElements[i];
      // const content = contentElements[i];
      // const dataContainer = dataElements[i];
      const paraBg = paraBgEl[i];
      const highlight = spanHighightElements[i];
      const paraLinkWordCol = paraLinkWordColEl[i];
      const h2 = h2TitleElements[i];
      const authorLinkCol = authorLinkElement[i];

      if (outer) {
        // outer.style.backgroundColor = isDarkTheme ? lightThemeBg : darkThemeBg;
        outer.style.color = !isDarkTheme ? lightThemeBg : darkThemeBg;
      }

      // if (content) {
      //   content.style.backgroundColor = isDarkTheme ? lightThemeBlend : darkThemeBlend;
      // }
      
      // if (dataContainer) {
      //   dataContainer.style.backgroundColor = isDarkTheme ? "rgba(255, 255, 255, 0.2)" : "transparent";
      // }
      
      if (paraBg) {
        paraBg.style.backgroundColor = isDarkTheme ? "#f1f1e9" : "#21212455";
      }

      if (h2) {
        h2.style.backgroundColor = !isDarkTheme ? "#1D1D20" : "#1D1D20";
        h2.style.color = !isDarkTheme ? "#fff" : "#fff";
      }

      if (highlight) {
        highlight.style.backgroundColor = isDarkTheme ? "#ffff00" : "#fdfd01";
        highlight.style.color = isDarkTheme ? "#111" : "#111";
      }
      
      if (paraLinkWordCol) {
        // paraLinkWordCol.style.backgroundColor = isDarkTheme ? "#ffff00" : "#55ff02";
        paraLinkWordCol.style.color = isDarkTheme ? "#ff0200" : "#3B82F6";
        paraLinkWordCol.style.borderBottom = isDarkTheme ? "3px solid red" : "3px solid #3B82F6";
      }
      
      if (authorLinkCol) {
        authorLinkCol.style.color = isDarkTheme ? "#000" : "#fff";
      }
      
    }

    // searchInput.style.backgroundColor = isDarkTheme ? "#fff" : "#111";
    // searchInput.style.color = isDarkTheme ? "#111" : "#fff";
    // searchInput.style.boxShadow = !isDarkTheme ? "0 0 0 #fff" : "0px -10px 50px #fff, 0px 0px 0px #fff, 0px 0px 0px #fff";

    // logo.style.color = !isDarkTheme ? "#212124" : "#f64056";
    // logo.style.textShadow = !isDarkTheme ? "-7px -1px 1px #f1f1f111, 1px -1px 1px #f1f1f111, 7px 1px 1px #f1f1f111, 1px 1px 1px #f1f1f111" : "-7px -1px 1px #f1f1f1, 1px -1px 1px #f1f1f1, 7px 1px 1px #f1f1f1, 1px 1px 1px #f1f1f1";

    logo.style.color = !isDarkTheme ? "#ff0200" : "#ff0200";
    logoSpan.style.color = !isDarkTheme ? "#fff" : "#111";
    // logo.style.textShadow = !isDarkTheme ? "-7px -1px 1px #f1f1f1, 1px -1px 1px #f1f1f1, 7px 1px 1px #f1f1f1, 1px 1px 1px #f1f1f1" : "-7px -1px 1px #f1f1f1, 1px -1px 1px #f1f1f1, 7px 1px 1px #f1f1f1, 1px 1px 1px #f1f1f1";

    const themeIcon = isDarkTheme ? "moon" : "sun";
    updateThemeIcon(themeIcon);

    // if the theme is toggled manually, reset the interval
    if (isUserToggled) {
      isUserToggled = false;
      resetThemeInterval();
    }
  } 

  function updateThemeIcon(icon) {
    const themeIconSVG = `
      <svg class="theme-${icon}-svg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
        ${icon === 'sun' ? '<path d="M10 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-11a1 1 0 0 0 1-1V1a1 1 0 0 0-2 0v2a1 1 0 0 0 1 1Zm0 12a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0v-2a1 1 0 0 0-1-1ZM4.343 5.757a1 1 0 0 0 1.414-1.414L4.343 2.929a1 1 0 0 0-1.414 1.414l1.414 1.414Zm11.314 8.486a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM4 10a1 1 0 0 0-1-1H1a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1Zm15-1h-2a1 1 0 1 0 0 2h2a1 1 0 0 0 0-2ZM4.343 14.243l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414a1 1 0 0 0-1.414-1.414ZM14.95 6.05a1 1 0 0 0 .707-.293l1.414-1.414a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 .707 1.707Z"/>' : ''}
        ${icon === 'moon' ? '<path d="M17.8 13.75a1 1 0 0 0-.859-.5A7.488 7.488 0 0 1 10.52 2a1 1 0 0 0 0-.969A1.035 1.035 0 0 0 9.687.5h-.113a9.5 9.5 0 1 0 8.222 14.247 1 1 0 0 0 .004-.997Z"/>' : ''}
      </svg>`;

    themeBtn.innerHTML = `<a>${themeIconSVG}</a>`;
}

//
//


  // function to reset the theme interval
  function resetThemeInterval() {
    // clear the interval if it was previously set
    if (themeInterval) {
      clearInterval(themeInterval);
      themeInterval = undefined;
    }

    // set a new 10 minutes interval if not in manual toggle mode
    if (!isUserToggled) {
      themeInterval = setInterval(() => {
        isDarkTheme = !isDarkTheme;
        applyTheme(isDarkTheme);
      }, 600000);
    }
  }

  // initialize the interval
  resetThemeInterval();



  // 
  // 
  });

