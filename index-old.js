
const process = require('process')
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

////////////////////////
function parseArgv() {
	const argv = process.argv.slice(2)
	const map = {}
	while( argv.length ) {
		const arg = argv.shift()
		if ( arg[0] === '-' )
			map[ arg.slice(1) ] = argv.shift()
	}
	return map
}
class DirEntry {
	constructor(absPath, pathParseResult, statResult) {
		Object.assign(this, statResult);
  
		this.isFile      = statResult.isFile();
		this.isDirectory = statResult.isDirectory();

		this.root = pathParseResult.root;
		this.dir  = pathParseResult.dir;
		this.base = pathParseResult.base;
		this.ext  = pathParseResult.ext;
		this.name = pathParseResult.name;
		
		this.path = absPath;
		
		for(const prop of ["root", "dir", "base", "name", "ext", "path"])
			this[`${prop}Low`] = this[prop].toLowerCase();
		
		this.parent = null;
		this.children = null;
	}
}
const readdirSync = (dir) => {
	const absDir = path.resolve(dir);
	return fs
		.readdirSync(absDir)
		.map(name => {
			const absPath = path.resolve( path.join(absDir, name) );
			return new DirEntry(absPath, path.parse(absPath), fs.statSync(absPath));
		});
}
const readdirDeepSync = (dir, dp = 1e6, parent = null) => {
	if ( dp <= 0 ) return [];

	const entries = readdirSync(dir);
	for(const entry of entries) {
		entry.parent = parent;
		if ( entry.isDirectory )
			entry.children = readdirDeepSync(entry.path, dp - 1, entry);
	}
	return entries;
}
const flatDirEntries = (dirEntries) => {
	const result = [];
	dirEntries.map(entry => {
		result.push(entry);
		if ( entry.isDirectory && entry.children )
			result.push(...flatDirEntries(entry.children));
	});
	return result;
}
const readdirDeepFlatSync = (dir, dp = 1e6) => {
	return flatDirEntries(readdirDeepSync(dir, dp));
}
const md5Hash = data => crypto
	.createHash('md5')
	.update(data)
	.digest("hex")
	.toUpperCase()
////////////////////////

const argvObj = parseArgv()
const DIR_IN  = argvObj.in  ?? "./in/patch"
const DIR_OUT = argvObj.out ?? "./out/patch"

async function make(srcDir, dstDir) {
	const srcDirLow = path.resolve(srcDir, "").toLowerCase()
	const dstDirLow = path.resolve(dstDir, "").toLowerCase()
	/**
	console.log(`Clear '${ dstDir }'`)
	readdirDeepFlatSync(dstDirLow).map(f => {
		try {
			fs.unlinkSync(f.path)
		} catch {}
	})
	*/
	console.log( srcDirLow )
	const files = readdirDeepFlatSync(srcDirLow)
	const entries = []
	files.map(f => {
		const pathRel = path
			.normalize('////' + f.path.slice(srcDirLow.length))
			.replace(/\//g, '\\')
		
		const dstPath = path.join(dstDirLow, "files", pathRel)
		if ( f.isDirectory ) {
			console.log( `Create dir '${ pathRel }'` )
			fs.mkdirSync(dstPath, { recursive: true })
			return
		}

		const fileData = fs.readFileSync(f.path)
		const fileHash = md5Hash(fileData)
		
		console.log( `Copy file '${ pathRel }'` )
		fs.mkdirSync(path.dirname(dstPath), { recursive: true })

		fs.writeFileSync(dstPath, Buffer.concat([
			Buffer.from([0,0,0,0]),
			fileData
		]))
		
		entries.push({
			Path: pathRel,
			Hash: fileHash,
		})
	})
	
	fs.writeFileSync(path.join(dstDirLow, "updateInfo.json"), JSON.stringify(entries))
}
 
make(DIR_IN, DIR_OUT)
