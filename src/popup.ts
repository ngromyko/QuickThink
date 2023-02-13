import '../styles/popup.scss';

function loadFrame(){
  const myFrame: any  = document.getElementById("kofiframe");
  myFrame.src =
    "https://ko-fi.com/n_gromyko/?hidefeed=true&widget=true&embed=true&preview=true";
};


loadFrame();