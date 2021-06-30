function lazyload() {
  const root = document.querySelector('#list');
  const options = {
    root,
    rootMargin: '0px',
    threshold: 0.3
  }
  const observer = new IntersectionObserver((entries, observer) => {
    console.log(entries);
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.src = entry.target.dataset.src;
        observer.unobserve(entry.target);
      }
    });
  }, options);

  const items = root.querySelectorAll('.lazyload');
  items.forEach(item => {
    observer.observe(item);
  });
}

lazyload();