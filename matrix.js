/*
    Wojciech Kuśmierz
    Rojek Marcin
    Wiśniewski Mateusz

    Skrypt zawierający operacje na macierzach, które pozwolą rozwiązywać przyszłe algorytmy
*/

function dimensionMatrix(A) {
	if(!Array.isArray(A)){
        throw "To nie jest macierz";
    } 
	var n = A.length;
	for(var i=0; i<n; i++) 
	{
		if(!Array.isArray(A[i])){
            throw "To nie jest macierz";
        } 		
	}
	var m = A[0].length;
	for(var i = 0; i < n; i++){
		if(A[i].length != m){
            throw "To nie jest macierz";
        } 	
		for(var j = 0; j < m; j++)
		if(typeof(A[i][j]) != 'number'){
            throw "To nie jest macierz";
        } 
	}	
	return {n,m};
}

function dotMatrix(A, B){
	var dmA = dimensionMatrix(A);
	var dmB = dimensionMatrix(B);
	if(dmA.m != dmB.n) throw "Nie można pomnożyć macierzy";
	var C = [];
	for(var w = 0; w < dmA.n; w++){
		C[w]=[];
		for(var k=0; k < dmB.m; k++){
			C[w][k] = 0;
			for(var i = 0; i < dmA.m; i++){
				C[w][k] += A[w][i] * B[i][k];
			}
		}
	}
	return C;
}

function detMatrix(A){
	var dM = dimensionMatrix(A);
	if(dM.m != 2 || dM.n != 2) throw "TYLKO DLA 2 STOPNIA";
	return A[0][0] * A[1][1] - A[0][1] * A[1][0];
}

function inverseMatrix(A) {
	var det = det(A);
	var B = [[],[]];
	B[0][0] = A[1][1]/det;
	B[0][1] =- A[0][1]/det;
	B[1][0] =- A[1][0]/det;
	B[1][1] = A[0][0]/det;
	return B;	
}

function rowMatrix(A) {
	var cutColumn = function(A,i){
	var B = [[],[]];
	for(var i = 0; i < 2; i++){
		k = 0;
		for(var j = 0; j < 3; j++) if(j != i){
			B[i][k] = A[i][j];
			k++;
		}
	}
	return B;
	}
	var dim = dimensionMatrix(A);
	if(dim.n == 2 && dim.m == 2){
		var d = det(A);
		if(d != 0) return 2;
		if(A[0][0] != 0)return 1;
		if(A[0][1] != 0)return 1;
		if(A[1][0] != 0)return 1;
		if(A[1][1] != 0)return 1;
		return 0;
	}
	else if(dim.n == 2 && dim.m == 3){		
		var r0 = rowMatrix(cutColumn(A,0));
		var r1 = rowMatrix(cutColumn(A,1));
		var r2 = rowMatrix(cutColumn(A,2));	
		return Math.max(r0,r1,r2);
	}
	else throw "Niedopuszczony rozmiar, tylko 2x2 i 3x3";	
}