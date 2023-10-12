const random_char = () => {
    const possible = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~" +
          "0123456789" +
          "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
          "abcdefghijklmnopqrstuvwxyz";
    return possible.charAt(Math.floor(Math.random() * possible.length));
  };
  
  const mask = (chars, progress) => {
    const masked = [];
  
    for (let i = 0; i < chars.length; i++) {
      const position = (i + 1) / chars.length;
      if (position > progress) {
        masked.push(random_char());
      } else {
        masked.push(chars[i]);
      }
    }
  
    return masked.join('');
  };
  
  const shuffle = el => {
    const chars = el.textContent.split('');
  
    const params = {
      progress: 0
    };
  
    const a = anime({
      targets: params,
      progress: 1,
      delay: 500,
      duration: 100,
      easing: 'easeInQuad',
      update: () => {
        el.textContent = mask(chars, params.progress);
      },
      complete: () => {
        el.classList.add('completed');
      }
    });

  };
  
  for (const el of document.querySelectorAll('.shuffle')) {
    shuffle(el);
  }
  