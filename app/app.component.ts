class AppController {
	title: string;

	constructor() {
		this.title = 'hello world';
		console.log('here');
	}
}

angular.module('rocket-start').component('app', {
	templateUrl: 'app.component.html',
	//template: '<h1>Title: {{$ctrl.title}}</h1>',
	controller: AppController
});