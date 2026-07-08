const list=document.getElementById('list');

window.onload=async ()=>{
  updateLoginUI();
  await applyHomePageSettings();
  const dorms = await loadDorms();
  render(dorms);
};

async function applyHomePageSettings(){
  const defaultSettings = {
    title: '우리 방에 오신 것을 환영합니다',
    backgroundColor: '#ffffff',
    backgroundPosition: 'center'
  };

  let settings = defaultSettings;
  if (typeof loadHomePageSettings === 'function') {
    try {
      const loaded = await loadHomePageSettings();
      if (loaded && typeof loaded === 'object') {
        settings = { ...defaultSettings, ...loaded };
      }
    } catch (error) {
      console.error('loadHomePageSettings failed:', error);
    }
  }

  const hero = document.getElementById('hero');
  const title = document.getElementById('hero-title');

  if (title && settings.title) {
    title.innerText = settings.title;
  }

  if (hero) {
    if (settings.backgroundImage) {
      hero.style.background = `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url('${settings.backgroundImage}') no-repeat ${settings.backgroundPosition || 'center'}`;
      hero.style.backgroundSize = 'cover';
      hero.style.color = '#fff';
    } else {
      hero.style.background = settings.backgroundColor || '#f5f5f5';
      hero.style.color = '#1e272e';
    }
  }
}

function updateLoginUI(){
  const member = typeof getCurrentMember === 'function'
    ? getCurrentMember()
    : null;
  const loginLink=document.getElementById('login-link');
  const userInfo=document.getElementById('user-info');
  const mypageLink=document.getElementById('mypage-link');
  const adminLink=document.getElementById('admin-link');

  if(member){
    mypageLink.style.display='inline';
    mypageLink.href='mypage.html';
    mypageLink.textContent='My Page';

    loginLink.textContent='Logout';
    loginLink.href='#';
    loginLink.onclick=(e)=>{
      e.preventDefault();

      if (typeof logoutMember === 'function') {
        logoutMember();
      }

      location.href='index.html';
    };

    userInfo.style.display='inline';
    userInfo.textContent=`${member.name} |`;
    adminLink.style.display='none';
  } else {
    mypageLink.style.display='none';
    loginLink.textContent='Login';
    loginLink.href='login.html';
    loginLink.onclick=null;
    userInfo.style.display='none';
    adminLink.style.display='inline';
  }
}

function render(arr){
  list.innerHTML='';
  arr.forEach(d=>{
    const price = typeof d.price === 'string' ? d.price : `$${d.price}/month`;
    const soldOutBadge = d.occupied ? '<div class="card-badge">SOLD OUT</div>' : '';
    list.innerHTML+=`
      <a href="detail.html?id=${d.id}" style="text-decoration:none;color:inherit">
        <div class="card">
          <div class="card-image-wrapper">
            ${soldOutBadge}
            <img src="${d.image}"/>
          </div>
          <div class="card-content">
            <h3>${d.name}</h3>
            <p>${d.city}</p>
            <p class="price">${price}</p>
          </div>
        </div>
      </a>`;
  });
}
