export interface ResourceProps {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  addedBy: string;
  date: string;
  tags?: string[];
  upvotes?: number;
  relevanceScore?: number;
  screenshot?: string | null;
}

export interface ResourceCardProps {
  resource: ResourceProps;
  variant?: 'compact' | 'full';
  onClick?: (id: string) => void;
  onUpvote?: (id: string) => void;
  showRelevanceScore?: boolean;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ 
  resource, 
  variant = 'compact', 
  onClick,
  onUpvote,
  showRelevanceScore = false
}) => {
  const { id, title, description, url, date, tags, upvotes = 0, relevanceScore = 0, screenshot } = resource;
  
  const getDomain = (url: string): string => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url;
    }
  };
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering card onClick
    if (onUpvote) {
      onUpvote(id);
    }
  };

  // Format relevance score as percentage
  const formatRelevanceScore = (score: number): string => {
    return `${Math.round(score * 100)}%`;
  };
  
  // Default placeholder image URL (create a simple placeholder image in public directory)
  const placeholderImage = '/images/resource-placeholder.svg';
  
  return (
    <div 
      className={`resource-card resource-card-${variant} card`}
      onClick={() => onClick && onClick(id)}
    >
      {/* Add screenshot image for both compact and full views */}
      <div className="resource-screenshot">
        <img 
          src={screenshot || placeholderImage} 
          alt={`Screenshot of ${title}`} 
          className="resource-screenshot-img"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            target.src = placeholderImage;
          }}
        />
      </div>
      
      <div className="resource-header flex justify-between items-center">
        <div className="flex flex-col">
          <h3 className="resource-title">{title}</h3>
          {showRelevanceScore && (
            <div className="relevance-score">
              <span className="relevance-label">Relevance: </span>
              <span className="relevance-value">{formatRelevanceScore(relevanceScore)}</span>
            </div>
          )}
        </div>
        
        <div className="upvote-container flex items-center">
          <button 
            className="upvote-button flex items-center gap-sm"
            onClick={handleUpvote}
            title="Upvote this resource"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="upvote-icon">
              <path d="M7 10v12" />
              <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
            </svg>
            <span className="upvote-count">{upvotes}</span>
          </button>
        </div>
      </div>
      
      {variant === 'full' && (
        <p className="resource-description">{description}</p>
      )}
      
      <div className="resource-details">
        <a 
          href={url} 
          className="resource-url" 
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          {getDomain(url)}
        </a>
        
        <span className="resource-meta">
          {formatDate(date)}
        </span>
      </div>
      
      {variant === 'full' && tags && tags.length > 0 && (
        <div className="resource-tags">
          {tags.map((tag) => (
            <span key={tag} className="resource-tag">
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {variant === 'full' && (
        <div className="resource-actions flex gap-sm" style={{ marginTop: 'var(--spacing-md)' }}>
          <button className="button-sm button-outline">Edit</button>
          <button className="button-sm button-outline">Delete</button>
        </div>
      )}
    </div>
  );
};

export default ResourceCard; 