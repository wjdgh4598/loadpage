/**
 * 중석식 데이터 생성
 */
 
function workerThread(obj){		/*myfi_BUG_594(Refactoring)*/
	
	const tUrl = '/buyclcln/buydraftmng/trnsfdmnd/saveMealIf/'+obj.coId+'/'+obj.year+'/'+obj.month;

	//HTTP 요청을 시작한다.
	const xhr = new XMLHttpRequest();
	
	//마지막 인자를 false로 정하여 요청을 동기 방식으로 보낸다.
	xhr.open("GET", tUrl, false);
	
	//응답이 완료될 때까지 대기한다.
	xhr.send();
	//요청이 실패하면 오류를 발생시킨다.
	
	if(xhr.status !== 200) {
		throw Error(xhr.status + " " + xhr.statusText + ": "+tUrl);
	}
	postMessage(xhr.responseText); 
}	

onmessage = function(e){
	workerThread(e.data);
}