function emptyClean() {
	fetch(`${movieUrl}`)
		.then((response) => response.json())
		.then((data) => data.filter((f) => {
			if (f.title === 1 || f.title === undefined || f.title.length < 2) {
				return f;
			}
			else if (typeof f.title === `undefined` || typeof f.genre === `undefined` || typeof f.rating === `undefined` || typeof f.director === `undefined` || typeof f.plot === `undefined`){
				return f;
			}
			else if(f.genre.length < 2 ){
				return f;
			}
		}))
		.then((data) => data.map(data => data.id))
		.then((results) => {
			results.forEach(f => fetch(`${movieUrl}${f}`, {
						method: `DELETE`, headers: {
							'Content-Type': 'application/json',
						}
					}
				)
					.then((data) => console.log(`Deleted ${data} successfully`))
			)
		})
		.then((response) => {
			console.log(`all record deleted successfully`, response);
		})
		.catch(error => console.error(error)); /* handle errors */
}

function updateEventHandler(){
	$(`.click-me`).click(function (event){
		currentID =  $(this).attr('id');
		console.log(currentID);
	});
}

function printData(data, style){
	if (style === `alpha`){
		data = data.sort((a,b) => {
			if (a.title.toUpperCase() < b.title.toUpperCase()){
				return -1;
			}
			if (a.title.toUpperCase() > b.title.toUpperCase()){
				return 1;
			}
			return 0;
		})
	}
	if (style === `alphaR`){
		data = data.sort((a,b) => {
			if (a.title.toUpperCase() < b.title.toUpperCase()){
				return 1;
			}
			if (a.title.toUpperCase() > b.title.toUpperCase()){
				return -1;
			}
			return 0;
		})
	}
	if (style === `rating`){
		data = data.sort((a,b) => {
			if (a.rating < b.rating){
				return -1;
			}
			if (a.rating > b.rating){
				return 1;
			}
			return 0;
		})
	}
	if (style === `ratingR`){
		data = data.sort((a,b) => {
			if (a.rating < b.rating){
				return 1;
			}
			if (a.rating > b.rating){
				return -1
			}
			return 0;
		})
	}
	$(`#reviewBlock`).replaceWith(`<div class="container" id="reviewBlock"></div>`)
	data.forEach(data => {
		let title = data.title;
		let genre = data.genre;
		let rating = data.rating;
		let director = data.director;
		let plot = data.plot;
			$(`#reviewBlock`).append(`<div class="row click-me" id="${data.id}">
											<div class="col-7">
												<div class="row">
													${title}
												</div>
												<div class="row">
													${plot}
												</div>
												<div class="row">
													${genre}
												</div>
												<div class="row">
													${director}
												</div>
											</div>
											<div class="col">
													${rating}
											</div>
										</div>`)

	})
	updateEventHandler();
	return data;
}

function loadReviews() {
	return fetch(`${movieUrl}`)
		.then((response) => response.json())
		.then((data) => {
			return data
		})
}