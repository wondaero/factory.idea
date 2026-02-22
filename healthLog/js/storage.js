// ==================== 파일 기반 저장소 ====================
// Capacitor Filesystem을 사용한 네이티브 파일 저장
// 웹에서는 localStorage fallback

const STORAGE_FILE = 'healthlog_data.json';
let isNative = false;
let Filesystem = null;
let Directory = null;

// Capacitor 플러그인 초기화
async function initStorage() {
    try {
        // Capacitor가 있고 Filesystem 플러그인이 등록되어 있는지 확인
        if (window.Capacitor?.isNativePlatform?.() && window.Capacitor?.Plugins?.Filesystem) {
            Filesystem = window.Capacitor.Plugins.Filesystem;
            Directory = { Data: 'DATA' };

            // 테스트 쓰기로 플러그인 동작 확인
            try {
                await Filesystem.writeFile({
                    path: '.storage_test',
                    data: 'test',
                    directory: Directory.Data,
                    encoding: 'utf8'
                });
                await Filesystem.deleteFile({
                    path: '.storage_test',
                    directory: Directory.Data
                });
                isNative = true;
                console.log('Storage: Native file system enabled');
            } catch (testErr) {
                console.log('Storage: Filesystem plugin test failed, using localStorage', testErr);
                isNative = false;
            }
        } else {
            console.log('Storage: Using localStorage (web or plugin not registered)');
        }
    } catch (e) {
        console.log('Storage: Using localStorage fallback', e);
    }
}

// 데이터 읽기
async function readStorage() {
    if (isNative && Filesystem) {
        try {
            const result = await Filesystem.readFile({
                path: STORAGE_FILE,
                directory: Directory.Data,
                encoding: 'utf8'
            });
            return JSON.parse(result.data);
        } catch (e) {
            // 파일이 없으면 빈 객체 반환
            if (e.message?.includes('not exist') || e.message?.includes('ENOENT')) {
                console.log('Storage: No existing file, starting fresh');
                return {};
            }
            console.error('Storage read error:', e);
            // 파일 읽기 실패시 localStorage에서 마이그레이션 시도
            const localData = localStorage.getItem('healthLog');
            if (localData) {
                console.log('Storage: Migrating from localStorage');
                const data = JSON.parse(localData);
                await writeStorage(data);
                return data;
            }
            return {};
        }
    } else {
        // localStorage fallback
        const data = localStorage.getItem('healthLog');
        return data ? JSON.parse(data) : {};
    }
}

// 데이터 쓰기
async function writeStorage(data) {
    const jsonStr = JSON.stringify(data);

    if (isNative && Filesystem) {
        try {
            await Filesystem.writeFile({
                path: STORAGE_FILE,
                data: jsonStr,
                directory: Directory.Data,
                encoding: 'utf8'
            });
            return true;
        } catch (e) {
            console.error('Storage write error:', e);
            // 실패시 localStorage에도 백업
            localStorage.setItem('healthLog', jsonStr);
            return false;
        }
    } else {
        // localStorage fallback
        localStorage.setItem('healthLog', jsonStr);
        return true;
    }
}

// 데이터 삭제
async function clearStorage() {
    if (isNative && Filesystem) {
        try {
            await Filesystem.deleteFile({
                path: STORAGE_FILE,
                directory: Directory.Data
            });
        } catch (e) {
            console.log('Storage clear error:', e);
        }
    }
    localStorage.removeItem('healthLog');
}

// 저장소 정보
function getStorageInfo() {
    return {
        isNative,
        type: isNative ? 'file' : 'localStorage'
    };
}
