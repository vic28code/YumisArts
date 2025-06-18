/* Template: Pavo Mobile App Website Tailwind CSS HTML Template
   Description: Custom JS file
*/
const firebaseConfig = {
    apiKey: "AIzaSyBHnihjo2df71IsWSiW-t44Djuxh4l_tRY",
    authDomain: "pintura2-36966.firebaseapp.com",
    projectId: "pintura2-36966",
    storageBucket: "pintura2-36966.firebasestorage.app",
    messagingSenderId: "496399802898",
    appId: "1:496399802898:web:198868bd05ad6570e5eecb"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Función para agregar una pintura entregada
async function agregarPinturaEntregada(nombre) {
    await db.collection("pinturasEntregadas").add({
        nombre: nombre,
        fecha: new Date()
    });
}

// Función para obtener las últimas 5 pinturas entregadas
async function obtenerPinturasEntregadas() {
    const querySnapshot = await db.collection("pinturasEntregadas")
        .orderBy("fecha", "desc")
        .limit(5)
        .get();
    const lista = [];
    querySnapshot.forEach((doc) => {
        lista.push(doc.data().nombre);
    });
    return lista;
}
// --- FIN: Configuración y funciones de Firebase ---

// Función para renderizar la tabla de pinturas entregadas
async function renderizarTablaPinturas() {
    const lista = await obtenerPinturasEntregadas();
    const tbody = document.querySelector('#tabla-pinturas-entregadas tbody');
    if (tbody) {
        tbody.innerHTML = '';
        lista.slice(-5).forEach(nombre => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${nombre}</td>`;
            tbody.appendChild(tr);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarTablaPinturas();

    let entregados = parseInt(localStorage.getItem('contadorEntregados')) || 0;
    let enProceso = parseInt(localStorage.getItem('contadorEnProceso')) || 0;
    let enEspera = parseInt(localStorage.getItem('contadorEnEspera')) || 0;

    function actualizarContadores() {
        document.getElementById('contador-entregados').textContent = entregados;
        document.getElementById('contador-enProceso').textContent = enProceso;
        document.getElementById('contador-enEspera').textContent = enEspera;
    }

    actualizarContadores();

    // Solo guarda en la base de datos cuando pasa de "en proceso" a "entregado"
    function procesarCuadros() {
        if (enEspera > 0) {
            enEspera--;
            enProceso++;
        } else if (enProceso > 0) {
            enProceso--;
            entregados++;
            const nombre = localStorage.getItem('ultimoNombrePintura');
            if (nombre) {
                agregarPinturaEntregada(nombre); // Solo aquí se guarda en la base de datos
                renderizarTablaPinturas();
                localStorage.removeItem('ultimoNombrePintura');
            }
        }

        localStorage.setItem('contadorEnEspera', enEspera);
        localStorage.setItem('contadorEnProceso', enProceso);
        localStorage.setItem('contadorEntregados', entregados);
        actualizarContadores();
    }

    setInterval(procesarCuadros, 60000);

    // En el submit, solo actualiza los contadores y guarda el nombre en localStorage
    const formulario = document.querySelector('#encarga-tu-cuadro form');
    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
            const nombreCuadro = document.getElementById('nombre_cuadro').value.trim();
            if (nombreCuadro) {
                localStorage.setItem('ultimoNombrePintura', nombreCuadro);
                enEspera++;
                localStorage.setItem('contadorEnEspera', enEspera);
                actualizarContadores();
            }
            formulario.reset();
            formulario.querySelectorAll('input, textarea').forEach(f => f.classList.remove('notEmpty'));
        });
    }
});

// jQuery y plugins solo si están disponibles
(function ($) {
	"use strict";
	$(window).on('scroll load', function () {
		if ($(".navbar").offset().top > 60) {
			$(".fixed-top").addClass("top-nav-collapse");
		} else {
			$(".fixed-top").removeClass("top-nav-collapse");
		}
	});

	// jQuery for page scrolling feature - requires jQuery Easing plugin
	$(function () {
		$(document).on('click', 'a.page-scroll', function (event) {
			var $anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $($anchor.attr('href')).offset().top
			}, 600, 'easeInOutExpo');
			event.preventDefault();
		});
	});

	// close menu on click in small viewport
	$('[data-toggle="offcanvas"], .nav-link:not(.dropdown-toggle)').on('click', function () {
		$('.offcanvas-collapse').toggleClass('open')
	});

	// hover in desktop mode
	function toggleDropdown(e) {
		const _d = $(e.target).closest('.dropdown'),
			_m = $('.dropdown-menu', _d);
		setTimeout(function () {
			const shouldOpen = e.type !== 'click' && _d.is(':hover');
			_m.toggleClass('show', shouldOpen);
			_d.toggleClass('show', shouldOpen);
			$('[data-toggle="dropdown"]', _d).attr('aria-expanded', shouldOpen);
		}, e.type === 'mouseleave' ? 300 : 0);
	}
	$('body')
		.on('mouseenter mouseleave', '.dropdown', toggleDropdown)
		.on('click', '.dropdown-menu a', toggleDropdown);

	/* Details Lightbox - Magnific Popup */
	if ($.fn.magnificPopup) {
		$('.popup-with-move-anim').magnificPopup({
			type: 'inline',
			fixedContentPos: true,
			fixedBgPos: true,
			overflowY: 'auto',
			closeBtnInside: true,
			preloader: false,
			midClick: true,
			removalDelay: 300,
			mainClass: 'my-mfp-slide-bottom'
		});
	}

	/* Card Slider - Swiper */
	if (typeof Swiper !== 'undefined') {
		var cardSlider = new Swiper('.card-slider', {
			autoplay: {
				delay: 4000,
				disableOnInteraction: false
			},
			loop: true,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev'
			},
			slidesPerView: 3,
			spaceBetween: 70,
			breakpoints: {
				767: {
					slidesPerView: 1
				},
				1023: {
					slidesPerView: 2,
					spaceBetween: 40
				}
			}
		});
	}

	/* Counter - CountTo */
	var a = 0;
	$(window).scroll(function () {
		if ($('#counter').length) {
			var oTop = $('#counter').offset().top - window.innerHeight;
			if (a == 0 && $(window).scrollTop() > oTop) {
				$('.counter-value').each(function () {
					var $this = $(this),
						countTo = $this.attr('data-count');
					$({
						countNum: $this.text()
					}).animate({
						countNum: countTo
					},
						{
							duration: 2000,
							easing: 'swing',
							step: function () {
								$this.text(Math.floor(this.countNum));
							},
							complete: function () {
								$this.text(this.countNum);
							}
						});
				});
				a = 1;
			}
		}
	});

	/* Move Form Fields Label When User Types */
	$("input, textarea").keyup(function () {
		if ($(this).val() != '') {
			$(this).addClass('notEmpty');
		} else {
			$(this).removeClass('notEmpty');
		}
	});

	/* Back To Top Button */
	$('body').prepend('<a href="body" class="back-to-top page-scroll">Back to Top</a>');
	var amountScrolled = 700;
	$(window).scroll(function () {
		if ($(window).scrollTop() > amountScrolled) {
			$('a.back-to-top').fadeIn('500');
		} else {
			$('a.back-to-top').fadeOut('500');
		}
	});

	/* Removes Long Focus On Buttons */
	$(".button, a, button").mouseup(function () {
		$(this).blur();
	});

	/* Function to get the navigation links for smooth page scroll */
	function getMenuItems() {
		var menuItems = [];
		$('.nav-link').each(function () {
			var hash = $(this).attr('href').substr(1);
			if (hash !== "")
				menuItems.push(hash);
		})
		return menuItems;
	}

	/* Prevents adding of # at the end of URL on click of non-pagescroll links */
	$('.nav-link').click(function (e) {
		var hash = $(this).attr('href').substr(1);
		if (hash == "")
			e.preventDefault();
	});

	/* Checks page scroll offset and changes active link on page load */
	changeActive();

	/* Change active link on scroll */
	$(document).scroll(function () {
		changeActive();
	});

	/* Function to change the active link */
	function changeActive() {
		const menuItems = getMenuItems();
		$.each(menuItems, function (index, value) {
			var offsetSection = $('#' + value).offset().top;
			var docScroll = $(document).scrollTop();
			var docScroll1 = docScroll + 1;

			if (docScroll1 >= offsetSection) {
				$('.nav-link').removeClass('active');
				$('.nav-link[href$="#' + value + '"]').addClass('active');
			}
		});
	}
})(jQuery);

