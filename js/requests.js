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
		if (currentID === 0){
			currentID =  $(this).attr('id');
			$(`#${currentID}`).removeClass(unselected);
			$(`#${currentID}`).addClass(selected);
		}
		else if ($(this).attr('id') !== currentID){
			$(`#${currentID}`).removeClass(selected);
			$(`#${currentID}`).addClass(unselected);
			currentID = $(this).attr('id');
			$(`#${currentID}`).removeClass(unselected);
			$(`#${currentID}`).addClass(selected);
		}
		else if ($(this).attr('id') === currentID){
			$(`#${currentID}`).removeClass(selected);
			$(`#${currentID}`).addClass(unselected);
			currentID = 0;
		}
		if (currentID !== 0){
			$(`#delete`).addClass(`visible`)
			$(`#delete`).removeClass(`invisible`)
			$(`#bar`).addClass(`invisible`);
			$(`#bar`).removeClass(`visible`);
		}
		else {
			$(`#delete`).removeClass(`visible`)
			$(`#delete`).addClass(`invisible`)
			$(`#bar`).addClass(`visible`);
			$(`#bar`).removeClass(`invisible`);
		}
	});
}


function deleteRecord(id){
	fetch(`${movieUrl}${id}`, {
			method: `DELETE`, headers: {
				'Content-Type': 'application/json',
			}
		}
		
	)
		.then((data) => console.log(`Deleted ID of ${currentID} successfully`))
	.then(() => {
		return new Promise((resolve)=>{ setTimeout(() => {
			resolve();}, 300);})})
		.then((loadReviews))
		.then((data)=> {printData(data, `raw`)
		})
		
}


function sendData(){
	return new Promise(function (resolve){
		let index = uniqueId();
		index.then((id) =>{
			const reviewObj = {
				id: id,
				title: $(`#title`).val(),
				rating: ratingValue,
				plot: $(`#plot`).val(),
				director: $(`#director`).val(),
				genre: $(`#genre`).val()
			};
			$(`#title`).val(``);
			$(`#rating`).val(``);
			$(`#plot`).val(``);
			$(`#director`).val(``);
			$(`#genre`).val(``);
			const url = movieUrl;
			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(reviewObj),
			};
			fetch(url, options)
				.then( response => console.log(`${response}  ..... added the record of ID: ${id}`)) /* review was created successfully */
				.catch( error => console.error(error) ); /* handle errors */
		})
		index.then(() => resolve())
	})
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
	$(`#insertReviews`).empty();
	data.forEach(data => {
		let title = data.title;
		let genre = data.genre;
		let rating = data.rating;
		let director = data.director;
		let plot = data.plot;
			$(`#insertReviews`).append(`<div class="row click-me ${unselected}" id="${data.id}">
											<div class="col-10">
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
											<div class="col align-self-center text-center">
											<h1 class="bi bi-${rating}-square-fill"></h1>
											</div>
										</div>`)

	})
	updateEventHandler();
	$(`#bar`).removeClass(`invisible`);
	$(`#bar`).addClass(`visible`);
	$(`#insertR`).empty();
	$(`#loading`).addClass(`d-none`);
	$(`#insertReviews`).removeClass(`d-none`)
	
	ratingValue = 0;
	return data;
}

function loadReviews() {
	return fetch(`${movieUrl}`)
		.then((response) => response.json())
		.then((data) => {
			global = data;
			return data;
		})
	
}

function uniqueId(){
	return	 fetch(`${movieUrl}`)
		.then((response) => response.json())
		.then((data) => data.map(data => data.id))
		.then((d) => d.sort())
		.then((d) => d[d.length-1]+1)
		.then((d) =>{
			return d
		} );
	
}
