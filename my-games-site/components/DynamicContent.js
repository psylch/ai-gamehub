import { useEffect, useRef } from 'react';

const DynamicContent = ({ content }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const scriptTags = containerRef.current.querySelectorAll('script');
      scriptTags.forEach(oldScriptTag => {
        const newScriptTag = document.createElement('script');
        newScriptTag.text = oldScriptTag.text;
        oldScriptTag.parentNode.replaceChild(newScriptTag, oldScriptTag);
      });
    }
  }, [content]);

  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: content }} />;
};

export default DynamicContent;
