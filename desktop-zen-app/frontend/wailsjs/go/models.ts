export namespace main {
	
	export class AppConfig {
	    lastDurationMinutes: number;
	
	    static createFrom(source: any = {}) {
	        return new AppConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.lastDurationMinutes = source["lastDurationMinutes"];
	    }
	}

}

