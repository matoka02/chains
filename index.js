// Function to build the longest sequence from fragments
function buildLongestSequence(fragments) {
  let longestSequence = "";

  // Helper function to recursively build a sequence
  function findSequence(current, remainingFragments) {
    if (remainingFragments.length === 0) {
      return current;
    }

    let maxSequence = current;

    for (let i = 0; i < remainingFragments.length; i++) {
      const fragment = remainingFragments[i];
      const lastTwoDigits = current.slice(-2);
      const firstTwoDigits = fragment.slice(0, 2);

      if (lastTwoDigits === firstTwoDigits) {
        const nextSequence = findSequence(
          current + fragment.slice(2),
          remainingFragments.filter((_, index) => index !== i)
        );

        if (nextSequence.length > maxSequence.length) {
          maxSequence = nextSequence;
        }
      }
    }

    return maxSequence;
  }

  // Try starting the sequence with each fragment
  for (let i = 0; i < fragments.length; i++) {
    const initialFragment = fragments[i];
    const remainingFragments = fragments.filter((_, index) => index !== i);

    const sequence = findSequence(initialFragment, remainingFragments);
    if (sequence.length > longestSequence.length) {
      longestSequence = sequence;
    }
  }

  return longestSequence;
}

// Handle file input and process the fragments
document.getElementById("processButton").addEventListener("click", () => {
  const fileInput = document.getElementById("fileInput");
  const fragmentsTextarea = document.getElementById("fragments");
  const resultDiv = document.getElementById("result");

  if (!fileInput.files.length) {
    alert("Please upload a file first.");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const fileContent = event.target.result;
    const fragments = fileContent
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0); // Remove empty lines

    fragmentsTextarea.value = fragments.join("\n");

    // Find the longest sequence
    const longestSequence = buildLongestSequence(fragments);
    resultDiv.textContent = `Longest sequence: ${longestSequence}`;
  };

  reader.readAsText(file);
});