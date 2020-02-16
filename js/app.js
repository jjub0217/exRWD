/**
 * 웹 카페 UI 인터렉션
 */
function demoWebCafeUI(){
	// 지역 변수
	var deviceMode = '';
	var isSlideIn = false;
	var breakpoint = 999;
	// DOM 노드 참조 변수
	var appNavigation = null;
	var buttonBurger = null;
	var menuList = null;
	var menuListItems = null;
	var menuLinks = null;

	// UI 인터랙션 초기화
	var init = function(){
		// 문서 객체를 찾아 지역 변수에 참조하는 함수 실행
		findDomNode();
		// 윈도우 너비가 변경되면 처리 될 이벤트 핸들러 연결
		window.addEventListener('resize', handleWindowResize);
		// 초기화 실행 시, 최초 윈도우 너비 감지 설정
		handleWindowResize();
	};

	// 문서 객체를 찾아 참조하는 함수
	var findDomNode = function(){
		appNavigation = document.querySelector('.appNavigation');
		buttonBurger = appNavigation.querySelector('.buttonBurger');
		menuList = appNavigation.querySelector('.menu__list');
		menuListItems = menuList.querySelectorAll('.menu__item');
		menuLinks = menuList.querySelectorAll('.menu__link');
	};

	// 장치 너비를 확인하여 mobile, desktop 모드를 감지하는 함수
	var getDeviceMode = function(){
		var currentMode = breakpoint < window.innerWidth ? 'desktop' : 'mobile';
		if (deviceMode === currentMode) {
			return 'same';
		}
		else {
			deviceMode = currentMode;
		}
		return deviceMode;
	};

	// 버거 버튼에 이벤트 추가하는 함수
	var addEventButtonBugger = function(){
		buttonBurger.addEventListener('click', handleSlideToggle);
	};

	// 버거 버튼에 이벤트 제거하는 함수
	var removeEventButtonBugger = function(){
		buttonBurger.removeEventListener('click', handleSlideToggle);
	};

	// 메뉴 리스트에 트랜지션 추가하는 함수
	var addTransitionMenuList = function(){
		menuList.style.transition = 'all 0.3s ease';
	};

	// 메뉴 리스트에 트랜지션 제거하는 함수
	var removeTransitionMenuList = function(){
		menuList.style.transition = null;
	};

	// 메뉴 리스트 슬라이드 인 함수
	var slideIn = function(){
		// 상태 업데이트
		isSlideIn = true;

		// 앱 내비게이션 활성화
		menuList.removeAttribute('hidden');
		window.setTimeout(function(){
			appNavigation.classList.add('isAct');
		}, 100);

		// 메뉴 리스트 이벤트 전파 차단 함수 추가
		menuList.addEventListener('click', handlePreventBrowserAction);

		// buttonBurger 상태 업데이트
		buttonBurger.setAttribute('aria-pressed', true);
		buttonBurger.setAttribute('aria-label', '메뉴 닫기');

		// 열린 상태에서 버거 버튼에 이벤트 연결
		buttonBurger.addEventListener('keydown', handleShiftTabButtonBurger);

		// 마지막 링크 요소를 찾아 tab 포커스 이동 연결
		var lastMenuLink = menuLinks[menuLinks.length - 1];
		lastMenuLink.addEventListener('keydown', handleKeyDownLastLink);

		// 슬라이드 토글 이벤트 연결
		document.addEventListener('click', handleSlideToggle);
		window.addEventListener('keydown', handleSlideToggle);
	};

	// 메뉴 리스트 슬라이드 아웃 함수
	var slideOut = function(){
		// 상태 업데이트
		isSlideIn = false;

		// 앱 내비게이션 비 활성화
		appNavigation.classList.remove('isAct');
		window.setTimeout(function(){
			menuList.setAttribute('hidden', true);
		}, 300);

		// 메뉴 리스트 이벤트 전파 차단 함수 제거
		menuList.removeEventListener('click', handlePreventBrowserAction);

		// buttonBurger 상태 업데이트
		buttonBurger.setAttribute('aria-pressed', false);
		buttonBurger.setAttribute('aria-label', '메뉴 열기');

		// 슬라이드 토글 이벤트 제거
		document.removeEventListener('click', handleSlideToggle);
		window.removeEventListener('keydown', handleSlideToggle);
	};

	// 클래스 추가 유틸리티 함수
	var addClass = function(target, className){
		if ('length' in target) {
			for (var i = 0, l = target.length; i < l; ++i) {
				target[i].classList.add(className);
			}
		}
		target.classList.add(className);
	};

	// 클래스 제거 유틸리티 함수
	var removeClass = function(target, className){
		if ('length' in target) {
			for (var i = 0, l = target.length; i < l; ++i) {
				target[i].classList.remove(className);
			}
		}
		else {
			target.classList.remove(className);
		}
	};

	// 보임, 안 보임 유무를 반환하는 유틸리티 함수
	var isVisible = function(target){
		return target.offsetParent !== null ? true : false;
	};

	// 모바일 설정 함수
	var settingMobile = function(){
		addEventButtonBugger();
		addTransitionMenuList();

		for (var i = 0, l = menuListItems.length; i < l; ++i) {
			var item = menuListItems[i];
			var link = item.querySelector('a.menu__link');
			// 초기화
			item.classList.remove('icon-star');
			link.removeEventListener('click', handlePreventBrowserAction);
			// 설정
			item.classList.add('icon-plus');
			link.addEventListener('click', handleExpandSubLink);
		}
	};

	// 데스크탑 설정 함수
	var settingDesktop = function(){
		removeEventButtonBugger();
		removeTransitionMenuList();

		for (var i = 0, l = menuListItems.length; i < l; ++i) {
			var item = menuListItems[i];
			var link = item.querySelector('a.menu__link');
			// 초기화
			item.classList.remove('icon-plus', 'icon-minus');
			link.removeEventListener('click', handleExpandSubLink);
			// 설정
			item.classList.add('icon-star');
			link.addEventListener('click', handlePreventBrowserAction);
		}
	};

	// 창 너비를 감지하여 아이콘 모드 변경을 처리하는 함수
	var handleWindowResize = function(e){
		switch (getDeviceMode()) {
			case 'mobile':
				settingMobile();
				break;
			case 'desktop':
				settingDesktop();
				break;
			default:
			// console.warn('동일한 장치 모드 상태');
		}
	};

	// 슬라이드 토글 처리 함수
	var handleSlideToggle = function(e){
		// 키보드 이벤트
		if (e.type === 'keydown') {
			if (e.keyCode === 27) {
				slideOut();
				buttonBurger.focus();
			}
		}
		else {
			e.stopPropagation();
			isSlideIn ? slideOut() : slideIn();
		}
	};

	// 모바일 내비게이션 메뉴 하위 항목 펼침 함수
	var handleExpandSubLink = function(e){
		e.preventDefault();
		e.stopPropagation();

		var expandListItem = this.parentNode;

		removeClass(menuListItems, 'menuAct');
		removeClass(menuListItems, 'icon-minus');

		addClass(expandListItem, 'menuAct');
		addClass(expandListItem, 'icon-minus');
	};

	// 브라우저 기본 동작 무시 함수
	var handlePreventBrowserAction = function(e){
		e.preventDefault();
		e.stopPropagation();
	};

	// 마지막 링크 요소에서 포커스 순환 이동 처리 함수
	var handleKeyDownLastLink = function(e){
		if (!e.shiftKey && e.keyCode === 9) {
			var subMenu = this.parentNode.querySelector('.menu__subMenu');
			// 서브 메뉴가 펼쳐지지 않은 상태일 경우
			if (!isVisible(subMenu)) {
				e.preventDefault();
				buttonBurger.focus();
			}
			else {
				// 서브 메뉴가 펼쳐진 상태일 경우
				var subLinks = subMenu.querySelectorAll('a');
				var lastSubLink = subLinks[subLinks.length - 1];
				lastSubLink.addEventListener('keydown', function(e){
					e.preventDefault();
					e.keyCode === 9 && buttonBurger.focus();
				});
			}
		}
	};

	// 버튼 버그의 shift + tab 키를 제어하는 함수
	var handleShiftTabButtonBurger = function(e){
		if (isSlideIn && e.shiftKey && e.keyCode === 9) {
			e.preventDefault();
			menuLinks[menuLinks.length - 1].focus();
		}
	};

	// DOM 콘텐츠가 준비되면 init 이벤트 핸들러 연결
	window.addEventListener('DOMContentLoaded', init);
}

// 웹 카페 UI 데모 실행
demoWebCafeUI();
