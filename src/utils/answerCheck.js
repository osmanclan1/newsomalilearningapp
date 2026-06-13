export function formatUserResponse(words) {
  return words.join(' ')
}

/**
 * True if selected tiles match any entry in acceptedAnswers exactly
 * (same words, same order — must match wordBank spelling).
 */
export function validateAnswer(selected, exchange) {
  const accepted = exchange?.acceptedAnswers
  if (!Array.isArray(accepted) || accepted.length === 0) return false

  return accepted.some(
    (answer) =>
      Array.isArray(answer) &&
      answer.length === selected.length &&
      answer.every((word, i) => word === selected[i]),
  )
}
