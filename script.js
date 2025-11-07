$(function(){
  const CART_KEY = 'orderra_cart';

  function getCart(){ return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
  function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); }
  function renderCart(){
    const cart = getCart();
    const $list = $('#cartList');
    $list.empty();
    if(!cart.length){
      $list.append('<li class="list-group-item">Cart is empty</li>');
      $('#cartTotal').text('$0');
      return;
    }
    let total = 0;
    cart.forEach((item, idx) => {
      total += Number(item.price);
      $list.append(
        `<li class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <strong>${item.name}</strong><br><small class="text-muted">$${item.price}</small>
          </div>
          <div>
            <button class="btn btn-sm btn-outline-danger remove-item" data-idx="${idx}">Remove</button>
          </div>
        </li>`
      );
    });
    $('#cartTotal').text('$' + total);
  }
  $('.add-to-cart').on('click', function(){
    const name = $(this).data('name');
    const price = $(this).data('price');
    const cart = getCart();
    cart.push({name, price});
    saveCart(cart);
    renderCart();
    $('#cartTotal').fadeOut(120).fadeIn(120);
  });

  $(document).on('click', '.remove-item', function(){
    const idx = $(this).data('idx');
    const cart = getCart();
    cart.splice(idx,1);
    saveCart(cart);
    renderCart();
  });

  $('#clearCart').on('click', function(){
    localStorage.removeItem(CART_KEY);
    renderCart();
  });
  renderCart();

  function enableValidation(formId, onSuccess){
    const $form = $(formId);
    $form.on('submit', function(e){
      e.preventDefault();
      const form = this;
      const $inputs = $(form).find('input,select,textarea');
      let valid = true;
      $inputs.each(function(){
        const el = this;
        if(!el.checkValidity()){
          $(el).addClass('is-invalid').removeClass('is-valid');
          valid = false;
        } else {
          $(el).addClass('is-valid').removeClass('is-invalid');
        }
      });
      if(valid){
        onSuccess && onSuccess();
        $(form).find('button[type="submit"]').prop('disabled', true).text('Sent');
        setTimeout(()=> {
          $(form).find('button[type="submit"]').prop('disabled', false).text('Send Message');
          $inputs.removeClass('is-valid');
          form.reset();
        }, 1400);
      } else {
        $(form).find('.is-invalid').first().focus();
      }
    });
  }

  enableValidation('#supportForm', function(){
    console.log('Support message sent');
    alert('Message sent. Support will contact you soon.');
  });

  enableValidation('#orderForm', function(){
    const orderNo = 'AF-' + Math.floor(Math.random()*9000 + 1000);
    alert('Order confirmed: ' + orderNo);
    localStorage.removeItem(CART_KEY);
    renderCart();
  });

  $('#btnSearch').on('click', function(){
    const q = $('#searchOrder').val().trim().toUpperCase();
    if(!q) {
      $('#ordersTable tbody tr').show();
      return;
    }
    $('#ordersTable tbody tr').each(function(){
      const $tr = $(this);
      const order = $tr.children().first().text().trim().toUpperCase();
      if(order.indexOf(q) !== -1){
        $tr.show().addClass('table-primary');
        $tr.fadeOut(80).fadeIn(80).delay(700).queue(function(next){ $(this).removeClass('table-primary'); next(); });
      } else {
        $tr.hide();
      }
    });
  });

  function prefillFromQuery(){
    const params = new URLSearchParams(window.location.search);
    const product = params.get('product');
    if(product){
      const priceMap = {'iPhone 14':1420,'Coffee maker':120,'Apple Watch':420};
      const name = decodeURIComponent(product);
      const p = priceMap[name] || 0;
      const cart = getCart();
      cart.push({name, price:p});
      saveCart(cart);
      renderCart();
      $('<div class="order-added-notice alert alert-success position-fixed top-0 end-0 m-3">Added '+name+'</div>')
        .appendTo('body').delay(1200).fadeOut(400, function(){ $(this).remove(); });
    }
  }
  prefillFromQuery();
  if(location.pathname.endsWith('catalog.html') || location.pathname.endsWith('/catalog.html')){
    $('.product-card').hide().each(function(i){
      $(this).delay(i*120).fadeIn(250);
    });
  }

  (function highlightNav(){
    const path = location.pathname.split('/').pop() || 'index.html';
    $('.navbar-nav .nav-link').each(function(){
      const href = $(this).attr('href');
      if(href === path) $(this).addClass('active');
    });
  })();
});