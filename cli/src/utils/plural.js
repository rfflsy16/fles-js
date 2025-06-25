const irregularPlurals = {
    'category': 'categories',
    'family': 'families',
    'city': 'cities',
    'story': 'stories',
    'country': 'countries',
    'baby': 'babies',
    'company': 'companies',
    'property': 'properties',
    'duty': 'duties',
    'lady': 'ladies',
    'penny': 'pennies',
    'puppy': 'puppies',
    'spy': 'spies',
    'sky': 'skies',
    'knife': 'knives',
    'life': 'lives',
    'wife': 'wives',
    'wolf': 'wolves',
    'leaf': 'leaves',
    'potato': 'potatoes',
    'tomato': 'tomatoes',
    'echo': 'echoes',
    'hero': 'heroes',
    'torpedo': 'torpedoes',
    'person': 'people',
    'man': 'men',
    'woman': 'women',
    'child': 'children',
    'foot': 'feet',
    'tooth': 'teeth',
    'goose': 'geese',
    'mouse': 'mice',
    'criterion': 'criteria',
    'phenomenon': 'phenomena',
    'analysis': 'analyses',
    'datum': 'data',
    'medium': 'media',
    'index': 'indices',
    'matrix': 'matrices',
    'vertex': 'vertices',
    'axis': 'axes',
    'crisis': 'crises',
    'thesis': 'theses',
    'quiz': 'quizzes',
    'bus': 'buses',
    'buffalo': 'buffaloes'
}

export function getPlural(word) {
    // Check irregular plurals first
    const lcWord = word.toLowerCase()
    if (irregularPlurals[lcWord]) {
        // Preserve original capitalization
        if (word[0] === word[0].toUpperCase()) {
            return irregularPlurals[lcWord].charAt(0).toUpperCase() +
                irregularPlurals[lcWord].slice(1)
        }
        return irregularPlurals[lcWord]
    }

    // Regular plural rules
    if (lcWord.endsWith('y')) {
        // Consonant + y = ies
        if (!'aeiou'.includes(lcWord.charAt(lcWord.length - 2))) {
            return word.slice(0, -1) + 'ies'
        }
    }

    if (lcWord.endsWith('s') ||
        lcWord.endsWith('sh') ||
        lcWord.endsWith('ch') ||
        lcWord.endsWith('x') ||
        lcWord.endsWith('z')) {
        return word + 'es'
    }

    // Default: just add 's'
    return word + 's'
} 