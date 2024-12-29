'use client';

import { useSession } from 'next-auth/react';
import Script from 'next/script';
import { useState } from 'react';

export default function HeapAnalytics(): React.ReactNode {
  const { data: session, status } = useSession();
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);

  const scriptReady = (): void => {
    if (window.heap) {
      setScriptLoaded(true);
    }
  };

  return (
    <Script
      id="heap-analytics"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
        window.heap = window.heap || [];
        heap.load = function(appId, config) {
          window.heap.appid = appId;
          window.heap.config = config = config || {};
          var script = document.createElement("script");
          script.type = "text/javascript";
          script.async = true;
          script.src = "https://cdn.heapanalytics.com/js/heap-" + appId + ".js";
          var firstScript = document.getElementsByTagName("script")[0];
          firstScript.parentNode.insertBefore(script, firstScript);
          var pushToHeap = function(method) {
            return function() {
              heap.push([method].concat(Array.prototype.slice.call(arguments, 0)));
            };
          };
          var methods = ["addEventProperties", "addUserProperties", "clearEventProperties", "identify", "resetIdentity", "removeEventProperty", "setEventProperties", "track", "unsetEventProperty"];
          for (var i = 0; i < methods.length; i++) {
            heap[methods[i]] = pushToHeap(methods[i]);
          }
        };
        heap.load(\`${process.env.NEXT_PUBLIC_HEAP_ANALYTICS_ID}\`);
        `
      }}
      onReady={scriptReady}
    />
  );
}
