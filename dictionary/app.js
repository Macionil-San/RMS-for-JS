// document.documentElement.style.colorScheme = 'dark' || 'light' // to change the color scheme

// VARIABLES
const body = document.querySelector('body');
const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, span, li, blockquote, code, pre, input, button, label, select, option, textarea');
const prefersDarkColorScheme = () => window && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

// Navbar
const logo = document.getElementById('logo');
const navbarFontSelector = document.getElementById('navbar-family__selector');
const navbarFontSelectorOptions = document.getElementById('font-family__selector');
const themeSelector = document.getElementById('switch__value'); // Checkbox type input
const lightMoonIcon = document.getElementById('light-mode-moon');
const darkMoonIcon = document.getElementById('dark-mode-moon');

// Search Bar
const searchBar = document.getElementById('search__bar');
const emptyText = document.getElementById('empty__text');

// Word Info
const wordInfo = document.getElementById('word-info');
const wordHeadingText = document.getElementById('word__heading');
const wordPhoneticText = document.getElementById('phonetic');
const wordAudioButton = document.getElementById('word__audio');

// Defintitions
const wordDefinition = document.getElementById('word-definitions');

// Word Not Found
const wordNotFound = document.getElementById('word-not-found');

// Misc
let currentWordData = {};

// Navbar Functions
navbarFontSelector.addEventListener('click', function() {
    navbarFontSelectorOptions.classList.toggle('hidden');
})

const handleFontChange = (fontFamily) => {
    console.log(fontFamily);
    if (fontFamily === 'Inter') {
        navbarFontSelector.innerHTML = "Sans Serif";
        let downArrowImage = document.createElement('img');
        downArrowImage.src = './assets/images/icon-arrow-down.svg';
        downArrowImage.alt = 'Arrow Down';
        navbarFontSelector.appendChild(downArrowImage);
        for (const element of textElements) {
            element.style.fontFamily = 'Inter, sans-serif';
        }
    } else if (fontFamily === 'Lora') {
        navbarFontSelector.innerHTML = "Serif";
        let downArrowImage = document.createElement('img');
        downArrowImage.src = './assets/images/icon-arrow-down.svg';
        downArrowImage.alt = 'Arrow Down';
        navbarFontSelector.appendChild(downArrowImage);
        for (const element of textElements) {
            element.style.fontFamily = 'Lora, serif';
        }
    }
    else if (fontFamily === 'Inconsolata') {
        navbarFontSelector.innerHTML = "Monospace";
        let downArrowImage = document.createElement('img');
        downArrowImage.src = './assets/images/icon-arrow-down.svg';
        downArrowImage.alt = 'Arrow Down';
        navbarFontSelector.appendChild(downArrowImage);
        for (const element of textElements) {
            element.style.fontFamily = 'Inconsolata, monospace';
        }
    }

    navbarFontSelectorOptions.classList.toggle('hidden');
}

// Theme Functions
const changeColorTheme = theme => {
    switch(theme) {
        case 'dark': {
            // Whole Body Theme
            document.documentElement.style.colorScheme = 'dark';
            body.style.backgroundColor = '#050505';
            localStorage.setItem('theme', 'dark');
            // Moon Icon Theme
            lightMoonIcon.classList.add('hidden');
            darkMoonIcon.classList.remove('hidden');
            // Search Bar Theme
            searchBar.style.backgroundColor = '#1F1F1F';
            
            themeSelector.checked = true;

            // source anchor element for dark mode
            let sourceURL = document.querySelector('.source a');
            sourceURL.style.color = '#FFFFFF';
            break;
        };
        case 'light': {
            // Whole Body Theme
            document.documentElement.style.colorScheme = 'light';
            body.style.backgroundColor = '#FFFFFF';
            localStorage.setItem('theme', 'light');
            // Moon Icon Theme
            lightMoonIcon.classList.remove('hidden');
            darkMoonIcon.classList.add('hidden');
            // Search Bar Theme
            searchBar.style.backgroundColor = '#F4F4F4';

            // source anchor element for light mode
            let sourceURL = document.querySelector('.source a');
            sourceURL.style.color = '#2D2D2D';
            break;
        };
    }

}

themeSelector.addEventListener('change', function() {
    if (themeSelector.checked) {
        changeColorTheme('dark')
    } else {
        changeColorTheme('light')
    }
});

const form = document.querySelector('form'); // Ensure you have a form element wrapping your input

form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    if (searchBar.value === '') {
        handleEmptySearch();
        return;
    }

    fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + searchBar.value)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        let wordData = () => {
            phoneticsArray = data[0].phonetics;
            for (const phonetic of phoneticsArray) {
                if (phonetic.text && phonetic.audio) {
                    return {
                        word: data[0].word,
                        phonetic: phonetic.text,
                        audio: phonetic.audio,
                        meaning: data[0].meanings,
                        sourceURLs: data[0].sourceUrls
                    }
                }
            }
        }

        currentWordData = wordData();
    
        handleWordInfo();
    })
    .catch(error => {
        wordInfo.classList.add('hidden');
        wordDefinition.classList.add('hidden');
        wordNotFound.classList.remove('hidden');
    });
});

// Retain the existing search event listener if needed
searchBar.addEventListener('search', function(event) {
    if (searchBar.value === '') {
        handleEmptySearch();
        return;
    }

    fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + searchBar.value)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        let wordData = () => {
            phoneticsArray = data[0].phonetics;
            for (const phonetic of phoneticsArray) {
                if (phonetic.text && phonetic.audio) {
                    return {
                        word: data[0].word,
                        phonetic: phonetic.text,
                        audio: phonetic.audio,
                        meaning: data[0].meanings,
                        sourceURLs: data[0].sourceUrls
                    }
                }
            }
        }

        currentWordData = wordData();
    
        handleWordInfo();
    })
    .catch(error => {
        wordInfo.classList.add('hidden');
        wordDefinition.classList.add('hidden');
        wordNotFound.classList.remove('hidden');
    });
});

// Search Bar Functions
// searchBar.addEventListener('search', async (event) => {
//     if (searchBar.value === '') {
//         handleEmptySearch();
//     }

//     fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + searchBar.value)
//     .then(response => response.json())
//     .then(data => {
//         console.log(data);
//         let wordData = () => {
//             // filter the data to make sure you get the right information (phonetics have both text and audio)
//             phoneticsArray = data[0].phonetics;
//             // Check each phonetic for the first one with a text and audio attribute
//             for (const phonetic of phoneticsArray) {
//                 if (phonetic.text && phonetic.audio) {
//                     return {
//                         word: data[0].word,
//                         phonetic: phonetic.text,
//                         audio: phonetic.audio,
//                         meaning: data[0].meanings,
//                         sourceURLs: data[0].sourceUrls
//                     }
//                 }
//             }
//         }

//         currentWordData = wordData();
    
//         handleWordInfo();
//     })
//     .catch(error => {
//         wordInfo.classList.add('hidden');
//         wordDefinition.classList.add('hidden')
//         wordNotFound.classList.remove('hidden');
//     })
// })

searchBar.addEventListener('input', () => {
    searchBar.classList.remove('search__bar--empty');
    emptyText.classList.add('hidden');
})

const handleEmptySearch = () => {
    searchBar.classList.add('search__bar--empty');
    searchBar.value = '';
    emptyText.classList.remove('hidden');
}

// Word Info Functions
const handleWordInfo = () => {
    wordHeadingText.innerText = currentWordData.word;
    wordPhoneticText.innerText = currentWordData.phonetic;

    if (currentWordData.audio) {
        wordAudioButton.href = currentWordData.audio;
        wordAudioButton.classList.remove('hidden');
    } else {
        wordAudioButton.classList.add('hidden');
    }

    wordDefinition.innerHTML = '';

    for (const meaning of currentWordData.meaning) {
        // word-meaning div
        let currentWordMeaning = document.createElement('div');
        currentWordMeaning.classList.add('word-meaning');
        wordDefinition.appendChild(currentWordMeaning);

        // word-meaning-info div
        let wordMeaningInfo = document.createElement('div');
        wordMeaningInfo.classList.add('word-meaning-info');
        currentWordMeaning.appendChild(wordMeaningInfo);

        // part of speech heading
        let wordPartOfSpeech = document.createElement('h2');
        wordPartOfSpeech.classList.add('partOfSpeech');
        wordPartOfSpeech.innerText = meaning.partOfSpeech;
        wordMeaningInfo.appendChild(wordPartOfSpeech);

        // part of speech horizontal bar
        let horizontalBar = document.createElement('div');
        horizontalBar.classList.add('horizontalBar');
        wordMeaningInfo.appendChild(horizontalBar);

        // meaning
        let wordMeaning = document.createElement('div');
        wordMeaning.classList.add('meaning');
        currentWordMeaning.appendChild(wordMeaning);

        // Meaning h3
        let meaningHeading = document.createElement('h3');
        meaningHeading.innerText = 'Meaning';
        wordMeaning.appendChild(meaningHeading);

        // Meaning ul
        let meaningList = document.createElement('ul');
        wordMeaning.appendChild(meaningList);

        for (const definition of meaning.definitions) {
            let meaningListItem = document.createElement('li');
            meaningListItem.classList.add('definition')
            meaningListItem.innerText = definition.definition;
            meaningList.appendChild(meaningListItem);

            if (definition.example) {
                meaningListItem.appendChild(document.createElement('br'));
                let meaningExample = document.createElement('span');
                meaningExample.classList.add('example');
                meaningExample.innerText = '"' + definition.example + '"';
                meaningListItem.appendChild(meaningExample);
            }
        }

        // Synonyms
        if (meaning.synonyms.length > 0) {

            // Synonyms h3
            let synonymsHeading = document.createElement('h4');
            synonymsHeading.innerText = 'Synonyms: ';
            synonymsHeading.classList.add("synonyms");
            wordMeaning.appendChild(synonymsHeading);

            // Synonyms span that will also search for the word
            for (const synonym of meaning.synonyms) {
                let synonymSpan = document.createElement('span');
                synonymSpan.innerText = synonym;
                synonymSpan.classList.add('synonym');
                synonymsHeading.appendChild(synonymSpan);

                synonymSpan.addEventListener('click', () => {
                    searchBar.value = synonymSpan.innerText;
                    searchBar.dispatchEvent(new Event('search'));
                })

                // seperate synonyms with commas
                if (meaning.synonyms.indexOf(synonym) !== meaning.synonyms.length - 1) {
                    synonymsHeading.appendChild(document.createTextNode(', '));
                }
            }
        }

        wordInfo.classList.remove('hidden');
        wordDefinition.classList.remove('hidden');
        wordNotFound.classList.add('hidden');
    }

    let horizontalBar = document.createElement('div');
    horizontalBar.classList.add('horizontalBar');
    wordDefinition.appendChild(horizontalBar);

    if (currentWordData.sourceURLs) {
        let sourceText = document.createElement('p');
        sourceText.innerText = 'Source: ';
        sourceText.classList.add('source');
        wordDefinition.appendChild(sourceText);

        let sourceURL = document.createElement('a');
        sourceURL.href = currentWordData.sourceURLs[0];
        sourceURL.innerText = currentWordData.sourceURLs[0];
        sourceURL.target = '_blank';
        sourceURL.rel = 'noopener noreferrer';
        sourceText.appendChild(sourceURL);

        if (!themeSelector.checked) {
            sourceURL.style.color = '#2D2D2D';
        }

        // new window image
        let newWindow = document.createElement('img');
        newWindow.src = './assets/images/icon-new-window.svg';
        newWindow.alt = 'New Window';
        newWindow.classList.add('newWindow');
        sourceURL.appendChild(newWindow);
    }
}

wordAudioButton.addEventListener('click', () => {
    const audio = new Audio(wordAudioButton.href);
    audio.play();
});

// Startup
const setUpFontFamily = () => {
    const navbarFontSelector = document.getElementById('font-family__selector');
    
    const fontFamily = localStorage.getItem('font-family');

    if (fontFamily === 'sans-serif') {
        navbarFontSelector.value = 'sans-serif';
        for (const element of textElements) {
            element.style.fontFamily = 'Inter, sans-serif';
        }
        navbarFontSelector.style.fontFamily = 'Inter';
        navbarFontSelector.style.paddingRight = '1.875rem';
    } else if (fontFamily === 'serif') {
        navbarFontSelector.value = 'serif';
        for (const element of textElements) {
            element.style.fontFamily = 'Lora, serif';
        }
        navbarFontSelector.style.fontFamily = 'Lora';
        navbarFontSelector.style.paddingRight = '0.07rem';
    } else if (fontFamily === 'monospace') {
        navbarFontSelector.value = 'monospace';
        for (const element of textElements) {
            element.style.fontFamily = 'Inconsolata, monospace';
        }
        navbarFontSelector.style.fontFamily = 'Inconsolata';
        navbarFontSelector.style.paddingRight = '2.75rem';
    }
}

const setUpTheme = () => {
    const themeSelector = document.getElementById('switch__value');
    const theme = localStorage.getItem('theme');

    if (theme === 'dark') {
        themeSelector.checked = true;
        changeColorTheme('dark');
    } else {
        themeSelector.checked = false;
        changeColorTheme('light');
    }
}

const setUpPrefersColorScheme = () => {
    const prefersColorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (prefersColorScheme) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }

    setUpTheme();
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('font-family') !== null) setTimeout(setUpFontFamily, 100); // Delay of 100ms to ensure fonts are loaded
    if (localStorage.getItem('theme') !== null) setUpTheme();

    // First time theme using prefers-color-scheme
    if (localStorage.getItem('theme') === null) {
        if (prefersDarkColorScheme()) {
            changeColorTheme('dark');
            return;
        }
        changeColorTheme('light');
    }

    // When document loads, display the definition for "keyboard"
    fetch('https://api.dictionaryapi.dev/api/v2/entries/en/keyboard')
    .then(response => response.json())
    .then(data => {
        let wordData = () => {
            phoneticsArray = data[0].phonetics;
            for (const phonetic of phoneticsArray) {
                if (phonetic.text && phonetic.audio) {
                    return {
                        word: data[0].word,
                        phonetic: phonetic.text,
                        audio: phonetic.audio,
                        meaning: data[0].meanings,
                        sourceURLs: data[0].sourceUrls
                    }
                }
            }
        }

        currentWordData = wordData();
    
        handleWordInfo();
    })
});
