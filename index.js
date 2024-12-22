document.getElementById("fileInput").addEventListener("change", handleFile, false);

async function handleFile(e) {
  const file = e.target.files[0];
  const output = document.getElementById("output");
  const fragmentsTextArea = document.getElementById("fragments");

  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.onload = async function (e) {
    const contents = e.target.result.trim();
    const numbers = contents.split(/\r?\n/).map(num => num.trim()).filter(Boolean); // Handle both Windows and Unix line endings

    // Display the loaded fragments in the textarea
    fragmentsTextArea.value = numbers.join('\n');

    output.innerText = "Solving puzzle...";
    const puzzle = await solvePuzzle(numbers);
    output.innerText = `Longest Sequence: ${puzzle}`;
  };

  reader.readAsText(file);
}

async function solvePuzzle(numbers) {
  const totalLength = numbers.reduce((sum, num) => sum + num.length, 0);

  // Find the first number (the one that doesn't match any suffix)
  const firstNumberIndex = findFirstNumber(numbers);
  let result = numbers[firstNumberIndex];
  numbers.splice(firstNumberIndex, 1);

  // Build the rest of the sequence
  result += await buildSequence(takeLastDigits(result), numbers);

  return result;

  function findFirstNumber(numbers) {
    for (let i = 0; i < numbers.length; i++) {
      const prefix = numbers[i].slice(0, 2);
      if (!numbers.some((num, index) => index !== i && num.endsWith(prefix))) {
        return i;
      }
    }
  }

  async function buildSequence(lastDigits, remainingNumbers) {
    let sequence = "";

    while (remainingNumbers.length) {
      const candidates = findMatchingPieces(lastDigits, remainingNumbers);

      if (candidates.length === 0) {
        break;
      }

      if (candidates.length > 1) {
        // If there are multiple options, explore all paths recursively
        const potentialSequences = [];
        for (const candidateIndex of candidates) {
          const candidate = remainingNumbers[candidateIndex];
          const newRemainingNumbers = [...remainingNumbers];
          newRemainingNumbers.splice(candidateIndex, 1);

          const partialSequence = candidate.slice(2) + await buildSequence(takeLastDigits(candidate), newRemainingNumbers);
          potentialSequences.push(partialSequence);
        }

        sequence += getLongestSequence(potentialSequences);
        break;
      } else {
        // Single matching candidate
        const candidateIndex = candidates[0];
        sequence += remainingNumbers[candidateIndex].slice(2);
        remainingNumbers.splice(candidateIndex, 1);
      }

      // Yield control back to the browser for responsiveness
      await new Promise(resolve => setTimeout(resolve, 0));
    }

    return sequence;
  }

  function findMatchingPieces(lastDigits, numbers) {
    return numbers
      .map((num, index) => (num.startsWith(lastDigits) ? index : -1))
      .filter(index => index !== -1);
  }

  function getLongestSequence(sequences) {
    return sequences.reduce((longest, current) => (current.length > longest.length ? current : longest), "");
  }

  function takeLastDigits(str) {
    return str.slice(-2);
  }
}