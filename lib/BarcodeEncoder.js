
module.exports.generate = function(string){
    var barcode = '\314';
    barcode += string;

    var values = string.split('').map(function(char){return this.decodeTable[char]},this);
    var checksum = 104;
    for(var i=0;i<values.length;i++){
        checksum += values[i]*(i+1);
    }
    barcode += this.encodeTable[checksum % 103];

    barcode += '\316';
    return barcode;
}

module.exports.count = function (input){
    return this.decode(input).split("1").length - 1;
}

module.exports.length = function (input){
    return this.decode(input).length;
}

module.exports.decode = function (input){
    var length = this.decodeTable[input.charAt(0)];
    var returnValue = "";
    var j = length;
    for(var i = 1; i < input.length;){
        var copies = this.decodeTable[input.charAt(i++)];
        var skips = this.decodeTable[input.charAt(i++)];
        var reads = this.decodeTable[input.charAt(i++)];
        var sequence = stringFill(stringFill("0",skips) + stringFill("1",reads),copies);
        returnValue += sequence;
    }

    returnValue += stringFill("0",length-returnValue.length);

    return returnValue;
}

module.exports.encode = function (input){
    var rest = input;
    var returnpattern = [this.encodeTable[rest.length]];
    var pattern = [];

    var flip = rest.charAt(0) == "0";

    var prevLoc = -1;
    while(1){
        var loc;

        if(flip)
            loc = rest.indexOf("01");
        else
            loc = rest.indexOf("10");

        if(loc == -1){
            pattern.push(rest.length);
            break;
        }else{
            pattern.push(rest.slice(0,loc+1).length);
            rest = rest.slice(loc+1);
            flip = !flip;
        }
    }

    if(pattern.length % 2 == 1)
        pattern.splice(-1);

    var repeat = 0;
    var pair = [0,0];
    for(i=0;i < pattern.length;i+=2){
        if(pattern[i] == pair[0] && pattern[i+1] == pair[1])
            repeat++;
        else{
            if(repeat != 0){
                returnpattern.push(this.encodeTable[repeat]);
                returnpattern.push(this.encodeTable[pair[0]]);
                returnpattern.push(this.encodeTable[pair[1]]);
            }
            repeat = 1;
            pair[0] = pattern[i];
            pair[1] = pattern[i+1];
        }
    }

    if(repeat != 0){
        returnpattern.push(this.encodeTable[repeat]);
        returnpattern.push(this.encodeTable[pair[0]]);
        returnpattern.push(this.encodeTable[pair[1]]);
    }

    return returnpattern.join('');
}

function stringFill(x, n) {
    var s = '';
    for (;;) {
        if (n & 1) s += x;
            n >>= 1;
        if (n) x += x;
        else break;
    }
    return s;
}

module.exports.decodeTable = {' ':0,'!':1,'"':2,'#':3,'$':4,'%':5,'&':6,'\'':7,'(':8,')':9,'*':10,'+':11,',':12,'-':13,'.':14,'/':15,'0':16,'1':17,'2':18,'3':19,'4':20,'5':21,'6':22,'7':23,'8':24,'9':25,':':26,';':27,'<':28,'=':29,'>':30,'?':31,'@':32,'A':33,'B':34,'C':35,'D':36,'E':37,'F':38,'G':39,'H':40,'I':41,'J':42,'K':43,'L':44,'M':45,'N':46,'O':47,'P':48,'Q':49,'R':50,'S':51,'T':52,'U':53,'V':54,'W':55,'X':56,'Y':57,'Z':58,'[':59,'\\':60,']':61,'^':62,'_':63,'`':64,'a':65,'b':66,'c':67,'d':68,'e':69,'f':70,'g':71,'h':72,'i':73,'j':74,'k':75,'l':76,'m':77,'n':78,'o':79,'p':80,'q':81,'r':82,'s':83,'t':84,'u':85,'v':86,'w':87,'x':88,'y':89,'z':90,'{':91,'|':92,'}':93,'~':94,'\303':95,'\304':96,'\305':97,'\306':98,'\307':99,'\310':100,'\311':101,'\312':102,'\313':103,'\314':104,'\315':105,'\316':106}
module.exports.encodeTable = [' ','!','"','#','$','%','&','\'','(',')','*','+',',','-','.','/','0','1','2','3','4','5','6','7','8','9',':',';','<','=','>','?','@','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','[','\\',']','^','_','`','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','{','|','}','~','\303','\304','\305','\306','\307','\310','\311','\312','\313','\314','\315','\316'];
