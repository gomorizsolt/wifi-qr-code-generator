import React from 'react';
import './App.css';
import qrcode from 'qrcode';

// TODO remove empty spaces, sanitize input if needed
// TODO escape special characters: / ; :
function App() {
  const [src, setSrc] = React.useState('');

  // React.useEffect(() => {
  //   async function getSrc() {
  //     const src = await qrcode.toDataURL('test');

  //     setSrc(src);
  //   }

  //   getSrc();
  // }, []);

  return <div className="App">{!!src && <img src={src} />}</div>;
}

export default App;
