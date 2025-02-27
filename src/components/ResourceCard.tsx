export interface ResourceProps {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  addedBy: string;
  date: string;
  tags?: string[];
}

export interface ResourceCardProps {
  resource: ResourceProps;
  variant?: 'compact' | 'full';
  onClick?: (id: string) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ 
  resource, 
  variant = 'compact', 
  onClick 
}) => {
  const { id, title, description, url, date, tags } = resource;
  
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
  
  return (
    <div 
      className={`resource-card resource-card-${variant} card`}
      onClick={() => onClick && onClick(id)}
    >
      <h3 className="resource-title">{title}</h3>
      
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