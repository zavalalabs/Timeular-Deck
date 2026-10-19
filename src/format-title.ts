const MAX_LINE_CHARS = 10;
const MAX_LINES = 3;

/**
 * Stream Deck keys are small and will wrap long titles mid-word in an ugly way. This greedily
 * wraps on word boundaries instead, capped at a few short lines with an ellipsis if it still
 * doesn't fit.
 */
export function formatActivityTitle(name: string): string {
	const words = name.split(/\s+/);
	const lines: string[] = [""];

	for (const word of words) {
		const line = lines[lines.length - 1];
		const candidate = line ? `${line} ${word}` : word;

		if (candidate.length <= MAX_LINE_CHARS || !line) {
			lines[lines.length - 1] = candidate;
		} else if (lines.length < MAX_LINES) {
			lines.push(word);
		} else {
			lines[MAX_LINES - 1] = `${lines[MAX_LINES - 1]}…`;
			break;
		}
	}

	return lines.join("\n");
}
