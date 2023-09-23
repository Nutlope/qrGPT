type PromptSuggestionProps = {
  suggestion: string;
  onClick: () => void;
  isLoading?: boolean;
};

/**
 * Renders a prompt suggestion pill-shaped button.
 */
export const PromptSuggestion: React.FC<PromptSuggestionProps> = ({
  suggestion,
  onClick,
  isLoading = false,
}) => {
  return (
    <button
      onClick={() => onClick()}
      disabled={isLoading}
      className={`border p-2 rounded-2xl dark:text-white ${
        !isLoading ? 'cursor-pointer' : 'cursor-not-allowed'
      } hover:bg-gray-100 dark:hover:bg-gray-500 transition`}
    >
      {suggestion}
    </button>
  );
};
