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
			else if(f.genre.length < 2 || typeof f.genre === `null` ){
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