import '../styles/popup.scss';

function loadFrame() {
  const myFrame: HTMLIFrameElement = document.getElementById('kofiframe') as HTMLIFrameElement;
  myFrame.src = 'https://ko-fi.com/n_gromyko/?hidefeed=true&widget=true&embed=true&preview=true';
}

loadFrame();
