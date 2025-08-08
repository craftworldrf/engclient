const fs = require("fs")
const path = require("path")

const RF_DIR = 'D:/BackUpEng/Forupdate'
//const RF_DIR = 'd:/RFOnlineClear/'
const FILES_MODEL = 'd:/updaterEng/files-model-for-make-patch'
const PATH_DIR = path.join(RF_DIR, '__build_mini_path__')

const WRITE_LIST = [
	//'D:/Updater/__test-build',
	'D:/updaterEng/in/patch',
	//'C:/Sandbox/User/RF_ONLINE/drive/D/RF-2.2.3.2-Client',
]

const dirList = [
	'rfex/',
	'rfex/config/',
	'rfex/log/',
	'rfex/storage/',
	'rfex/src/',
	'rfex/src/electron/',
	'rfex/src/electron/public/',
	'rfex/src/electron/public/build/',
	'rfex/src/electron/public/src/',
	'rfex/src/electron/public/rfdata/',
	
	'datatable',
	
	'rfex/src/bin/',
]
const list = [
	'rfex.asi',
	'rfex/src/nodejs-addon-shared-memory-bitmap/build/Release/shared-memory-bitmap.node',
	'libgcc_s_sjlj-1.dll',
	'libstdc++-6.dll',
	'libwinpthread-1.dll',

	'ABuse.dll',
	'Adv.dll',
	'd3dx9_32.dll',
	'd3dx9_34.dll',
	'd3dx9_36.dll',
	'dbghelp.dll',
	'MSS32.DLL',
	'PDLL.dll',
	'PurifierA.dll',
	'RF_Online.bin',
	'StringLoaderA.dll',
]
const ignoreList = [
	'rfex/bin/',
	'rfex/storage/inventory/',
	'rfex/src/create-client-data/',
	'rfex/src/create-client-mini-path/',
	'rfex/src/dll/',
	'rfex/log/',
	//'rfex/src/electron/public/rfdata/',

]
console.log(RF_DIR)

function fsReaddirFlatSync(dir) {
	return fs
		.readdirSync(dir)
		.map(f => path.join(dir, f))
		.map(f => ({
			stat: fs.lstatSync( f ),
			path: f
		}))
		.map(e => e.stat.isDirectory() ? fsReaddirFlatSync(e.path) : e)
		.flat(1e9)
}
function fsCopy(src, dst) {
	src = src.toLowerCase()
	dst = dst.toLowerCase()
	if ( fs.lstatSync( src ).isDirectory() )
		return fs.mkdirSync( dst, { recursive: true } )
	
	fs.mkdirSync( path.dirname(dst), { recursive: true } )
	fs.writeFileSync(dst, fs.readFileSync(src))
}

function createPath(dstDir) {
	/*
	const files = fs
		.readdirSync(dstDir)
		.map(v => v.match(/v(\d+)\.(\d+)\.(\d+)$/))
		.filter(Boolean)
		.map(v => {
			const ver = v.slice(1).map(Number)
			return {
				dir: v[0],
				ver,
				verNum: [...ver].reverse().reduce((s, v, i) => s + (v << (i*10)))
			}
		})
		.sort((l, r) => l.verNum - r.verNum)
	
	const ver = [...files.pop()?.ver ?? [0, 0, 0]]
	ver[2]++
	ver[2] = String(ver[2]).padStart(3, '0')
	const dir = 'cl-mini-path-v'+ver.join('.')
	
	const dstFullDir = path.join(dstDir, dir)
	*/
	const dstFullDirList = [...WRITE_LIST, ]

	dstFullDirList.map(d =>
		dirList.map(dir => fs.mkdirSync( path.join(d, dir), { recursive: true } ) ) )
	
	const normalizeIgnoreList = ignoreList.map(f => path.join(f))
	const _dir = path.join(RF_DIR)
	fsReaddirFlatSync( path.join(RF_DIR, 'rfex') )
		.filter(e => !/(create\-client\-data)|(create\-client\-mini\-path)/i.test(e.path))
		.filter(e => !/(rfex[\/\\]storage[\/\\]inventory)/i.test(e.path))
		.filter(e => !/(rfex[\/\\]log)/i.test(e.path))
		.map(e => {
			const pathRel = e.path.slice(_dir.length)
			if ( normalizeIgnoreList.some(f => pathRel.indexOf(f) === 0) )
				return
			
			console.log(pathRel)
			dstFullDirList.map(d =>
				fsCopy(
					path.join(RF_DIR, pathRel),
					path.join(d, pathRel)
				)	
			)
		})
	
	dstFullDirList.map(d => 
		list.map(f => fsCopy(
			path.join(RF_DIR, f),
			path.join(d, f)
		))
	)
	
	//console.log('End')
	//process.kill(0)
}


function copyFromFilesModel(filesModelDir) {
	filesModelDir = path.resolve(filesModelDir)
	const files = fsReaddirFlatSync(filesModelDir)
	fs.writeFileSync("./create-client-path-files-model.json", JSON.stringify( files.map(f => f.path), 1 ,1 ) )
	
	files.map(f => {
		const pathRel = f.path.slice(filesModelDir.length)
		console.log(`[Model] Copy file '${ pathRel }'`)
		
		const srcPath = path.join(RF_DIR, pathRel)
		WRITE_LIST.map(dir => {
			const dstPath = path.join(dir, pathRel)
			try {
				fsCopy(srcPath, dstPath)
			} catch(e) {
				console.error(e.message)
			}
		})
	})
}

createPath(PATH_DIR)
copyFromFilesModel(FILES_MODEL)