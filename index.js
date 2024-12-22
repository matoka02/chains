document.getElementById('fileInput')
  .addEventListener('change', readFile, false);

function readFile(e) {
  let file = e.target.files[0];
  let output = document.getElementById('output');
  let maxLengthElement = document.getElementById('maxLength');

  if (!file) {
    return;
  }

  let reader = new FileReader();
  reader.onload = function (e) {
    let contents = e.target.result;

    let numbers = contents.indexOf('\r') ? contents.split('\r\n') : contents.split('\n');
    let puzzle = completePuzzle(numbers);

    output.innerText = puzzle;

    maxLengthElement.innerText = `Length: ${puzzle.length}`;
  };

  output.innerText = 'Solving puzzle...';
  reader.readAsText(file);
}

function completePuzzle(numbers) {
  let totalLength = numbers.reduce((acc, el) => acc += el.length, 0);

  let firstNumberIndex = findFirstNumber(numbers);
  let result = numbers[firstNumberIndex];
  removeFromArray(numbers, firstNumberIndex);

  result += tryCompletePuzzle(takeLastDigits(result), [...numbers], result.length);

  return result;

  function tryCompletePuzzle(ld, numbers, offset) {
    let result = '';

    while (numbers.length) {
      let lastDigits = result.length ? takeLastDigits(result) : ld;

      let potentialPieces = getPotentialPieces(numbers);

      if (potentialPieces.length > 1) {
        let potentialSets = [];
        for (let i = 0; i < potentialPieces.length; i++) {
          let numbersCopy = [...numbers];
          removeFromArray(numbersCopy, potentialPieces[i]);
          let potentialSet = numbers[potentialPieces[i]] +
            tryCompletePuzzle(takeLastDigits(numbers[potentialPieces[i]]),
              numbersCopy,
              offset + result.length + numbers[potentialPieces[i]].length);

          potentialSets.push(potentialSet);
        }

        return result + getLongest(potentialSets);
      } else if (potentialPieces.length == 1) {
        result += numbers[potentialPieces[0]];
        numbers.splice(potentialPieces[0], 1);
      } else {
        break;
      }

      function getPotentialPieces(numbers) {
        let potentialPieces = [];
        for (let i = 0; i < numbers.length; i++) {
          if (numbers[i].startsWith(lastDigits)) {
            potentialPieces.push(i);
          }
        }

        return potentialPieces;
      }

      function getLongest(array) {
        let longest = array[0];

        for (let i = 1; i < array.length; i++) {
          if (longest.length < array[i].length)
            longest = array[i];
        }

        return longest;
      }
    }

    return result;
  }

  function takeLastDigits(string) {
    return string.substring(string.length - 2);
  }

  function removeFromArray(array, index) {
    array.splice(index, 1);
  }

  function findFirstNumber(numbers) {
    for (let i = 0; i < numbers.length; i++) {
      if (!subSearch(numbers[i].substring(0, 2), i))
        return i;
    }

    function subSearch(number, skipIndex) {
      for (let j = 0; j < numbers.length; j++) {
        if (j == skipIndex) continue;

        if (numbers[j].endsWith(number))
          return true;
      }
    }
  }
}




// document.getElementById("fileInput").addEventListener("change", handleFile, false);

// async function handleFile(e) {
//   const file = e.target.files[0];
//   const output = document.getElementById("output");
//   const fragmentsTextArea = document.getElementById("fragments");
//   const maxLengthParagraph = document.getElementById("maxLength");

//   if (!file) {
//     return;
//   }

//   const reader = new FileReader();

//   reader.onload = async function (e) {
//     const contents = e.target.result.trim();
//     const numbers = contents.split(/\r?\n/).map(num => num.trim()).filter(Boolean); // Handle both Windows and Unix line endings

//     // Display the loaded fragments in the textarea
//     fragmentsTextArea.value = numbers.join('\n');

//     output.innerText = "Solving puzzle...";
//     const puzzle = await solvePuzzle(numbers);

//     // Display the result and length of the sequence
//     output.innerText = `Longest Sequence: ${puzzle}`;
//     maxLengthParagraph.innerText = `Length: ${puzzle.length} characters`;
//   };

//   reader.readAsText(file);
// }

// async function solvePuzzle(numbers) {
//   const totalLength = numbers.reduce((sum, num) => sum + num.length, 0);

//   // Find the first number (the one that doesn't match any suffix)
//   const firstNumberIndex = findFirstNumber(numbers);
//   let result = numbers[firstNumberIndex];
//   numbers.splice(firstNumberIndex, 1);

//   // Build the rest of the sequence
//   result += await buildSequence(takeLastDigits(result), numbers);

//   return result;

//   function findFirstNumber(numbers) {
//     for (let i = 0; i < numbers.length; i++) {
//       const prefix = numbers[i].slice(0, 2);
//       if (!numbers.some((num, index) => index !== i && num.endsWith(prefix))) {
//         return i;
//       }
//     }
//   }

//   async function buildSequence(lastDigits, remainingNumbers) {
//     let sequence = "";

//     while (remainingNumbers.length) {
//       const candidates = findMatchingPieces(lastDigits, remainingNumbers);

//       if (candidates.length === 0) {
//         break;
//       }

//       if (candidates.length > 1) {
//         // If there are multiple options, explore all paths recursively
//         const potentialSequences = [];
//         for (const candidateIndex of candidates) {
//           const candidate = remainingNumbers[candidateIndex];
//           const newRemainingNumbers = [...remainingNumbers];
//           newRemainingNumbers.splice(candidateIndex, 1);

//           const partialSequence = candidate.slice(2) + await buildSequence(takeLastDigits(candidate), newRemainingNumbers);
//           potentialSequences.push(partialSequence);
//         }

//         sequence += getLongestSequence(potentialSequences);
//         break;
//       } else {
//         // Single matching candidate
//         const candidateIndex = candidates[0];
//         sequence += remainingNumbers[candidateIndex].slice(2);
//         remainingNumbers.splice(candidateIndex, 1);
//       }

//       // Yield control back to the browser for responsiveness
//       await new Promise(resolve => setTimeout(resolve, 0));
//     }

//     return sequence;
//   }

//   function findMatchingPieces(lastDigits, numbers) {
//     return numbers
//       .map((num, index) => (num.startsWith(lastDigits) ? index : -1))
//       .filter(index => index !== -1);
//   }

//   function getLongestSequence(sequences) {
//     return sequences.reduce((longest, current) => (current.length > longest.length ? current : longest), "");
//   }

//   function takeLastDigits(str) {
//     return str.slice(-2);
//   }
// }