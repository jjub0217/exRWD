(function() {
    'use strict';
    var gridToggleClass = function (e) {
        var gridSystem = document.querySelector('.gridSystem');
        if (e.keyCode === 27) {
            gridSystem.classList.toggle('isActive');
        }
    };
    window.addEventListener('keyup', gridToggleClass);
})(window);