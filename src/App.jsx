import { useState, Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'
import { Model as Room } from './Room'

function App() {
  const [selectedFurniture, setSelectedFurniture] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [sortBy, setSortBy] = useState('year');

  // --- TV Media List (어미 수정 완료) ---
  const tvMediaList = [
    { name: "의리적 구토", date: "1919. 10", genre: "영화", status: "완전 소실", details: "[역사적 의의] 한국 최초의 연쇄극(영화).\n[상세] 1919년 단성사 개봉작으로 한국 영화사의 기점이다. 그러나 한국전쟁 중 필름이 전량 소실되어 현재는 신문 광고와 몇 장의 사진으로만 존재를 확인할 수 있는 '완전 소실' 상태이다." },
    { name: "아리랑", date: "1926. 10", genre: "영화", status: "필름 유실", details: "[역사적 의의] 나운규 감독의 민족적 걸작.\n[상세] 일제강점기 우리 민족의 한을 담은 최고의 명작이나, 해방 이후 혼란기에 마스터 필름이 유실되었다. 일본의 한 수집가가 소장 중이라는 소문이 수십 년간 돌았으나 결국 발견되지 못한 채 미궁에 빠져 있다." },
    { name: "심청전", date: "1937", genre: "영화", status: "필름 유실", details: "[상세] 한국 영화사 초기 유성 영화의 선구적 작품이다. 기술적 과도기의 기록으로서 가치가 매우 높으나 필름 보관실 화재와 관리 부실로 인해 원본이 유실되었다." },
    { name: "자유만세", date: "1946", genre: "영화", status: "일부 유실", details: "[상세] 광복 후 제작된 첫 영화이다. 원본 필름의 상당 부분이 훼손된 채 발견되어 현재는 영상 일부가 잘려나간 불완전한 상태로만 감상이 가능하다." },
    { name: "피아골", date: "1955", genre: "영화", status: "일부 유실", details: "[상세] 리얼리즘 영화의 시작을 알린 작품이다. 오랫동안 필름이 없는 것으로 알려졌으나 이후 발굴되었다. 하지만 사운드 테이프의 손상이 심해 일부 장면의 음향 복원이 완벽하지 않다." },
    { name: "하녀", date: "1960", genre: "영화", status: "복원본 존재", details: "[상세] 김기영 감독의 대표작이다. 마스터 필름이 한때 유실되었으나, 세계 영화 재단의 도움으로 카피본 필름을 발굴하여 디지털 복원에 성공한 드문 케이스이다." },
    { name: "오발탄", date: "1961", genre: "영화", status: "원본 유실", details: "[상세] 유현목 감독의 걸작이다. 원본 네거티브 필름은 소실되었고, 다행히 보관되어 있던 프린트 필름을 바탕으로 복원하여 현재까지 전해지고 있다." },
    { name: "만추", date: "1966. 12.", genre: "영화", status: "필름 유실", details: "[역사적 의의] 이만희 감독의 미학적 정점.\n[상세] 한국 영화사 최고의 걸작으로 손꼽히지만, 필름이 완전히 사라진 상태이다. 현재 전 세계의 아카이브를 뒤지며 필름을 찾고 있으나 아직 소식이 없는 '미싱 링크' 중 하나이다." },
    { name: "로보트 태권 V", date: "1976", genre: "애니메이션", status: "복원본 존재", details: "[상세] 원본 애니메이션 셀과 필름이 유실된 것으로 알려져 절망적이었으나, 2003년 영화진흥위원회 창고에서 복사본 필름이 극적으로 발견되어 다시 세상에 나왔다." },
    { name: "Heavyweight Champ", date: "1976", genre: "콘솔 게임", status: "완전 소실", details: "[상세] 세가에서 만든 세계 최초의 1인칭 시점 권투 게임이다. 1976년 흑백 버전의 기판 데이터가 전 세계 어디에도 남아있지 않아 디지털 역사에서 사라진 유물이 되었다." },
    { name: "전설의 고향", date: "1977", genre: "TV 드라마", status: "일부 유실", details: "[상세] 한국형 공포 드라마의 시초이다. 방송사 아카이브 관리 체계가 잡히기 전이라 70년대 방영분 중 상당수 에피소드의 마스터 테이프가 유실된 상태이다." },
    { name: "꽃의 요정 루루", date: "1980", genre: "애니메이션", status: "더빙판 일부 유실", details: "[상세] 80년대 인기 방영 애니메이션이다. 일본판은 있으나 추억의 한국어 성우진 목소리가 담긴 더빙판 마스터 테이프가 방송사 기록에서 누락되었다." },
    { name: "꼬마자동차 붕붕", date: "1985. 4.", genre: "애니메이션", status: "일부 유실", details: "[상세] 한국어 더빙 버전의 마스터 테이프 상당수가 유실되었다. 현재 인터넷에 돌아다니는 영상들은 당시 개인 유저들이 비디오 데크로 녹화한 저화질 자료들이 대부분이다." },
    { name: "아이댄스 (iDance)", date: "1999", genre: "게임", status: "완전 소실", details: "[상세] 국산 리듬 게임의 초기 개척작이다. 제작사가 도산하면서 서버 데이터와 소스 코드가 모두 폐기되어 현재는 구동 가능한 버전이 전무하다." },
    { name: "수수께끼 블루", date: "2000. 7", genre: "애니메이션", status: "일부 유실", details: "[상세] EBS에서 방영된 인기 교육물이다. 교육용 자료임에도 불구하고 방송사 아카이브 보관 과정에서 초기 방영분 상당수가 유실되었다." },
    { name: "꼬마 고양이 마오", date: "2002. 5", genre: "애니메이션", status: "비디오 완전 소실", details: "[상세] 지상파에서 정식 방영되었으나 시청률 저조 및 홍보 부족으로 인해 어떠한 VOD나 DVD, 심지어 개인 녹화본조차 발견되지 않는 미스테리한 작품이다." },
    { name: "Bones: Skeleton Crew", date: "2005", genre: "TV 드라마", status: "일부 유실", details: "[상세] 제작 도중 스튜디오 화재로 인해 촬영된 마스터 테이프의 절반 이상이 불타버렸다. 결국 불완전한 상태로 방영되거나 일부 장면은 아예 삭제되었다." },
    { name: "라즈베리 타임즈", date: "2006. 11", genre: "애니메이션", status: "일부 유실", details: "[상세] 한일 합작 애니메이션으로 한국어 더빙 버전의 특정 회차 데이터가 방송사 서버 오류로 인해 영구적으로 손상되었다." }
  ];

  // --- Laptop Media List (어미 수정 완료) ---
  const laptopMediaList = [
    { name: "세이클럽 아바타", date: "1999", genre: "커뮤니티", status: "완전 유실", details: "[상세] 전 세계 최초의 아바타 유료화 수익 모델이다. 서비스 종료 이후 유저들의 수많은 아바타 조합 데이터와 개인화 리소스가 백업 없이 전량 폐기되었다." },
    { name: "프리첼", date: "1999", genre: "커뮤니티", status: "일부 유실", details: "[상세] 유료화 파동 당시 수만 개의 커뮤니티가 폐쇄되었다. 당시 이용자들이 올린 귀중한 디지털 사진과 게시글 자료들이 아카이빙되지 못한 채 서버와 함께 사라졌다." },
    { name: "다모임", date: "1999", genre: "커뮤니티", status: "완전 유실", details: "[상세] 90년대 후반 동창 찾기 열풍을 일으킨 사이트이다. 사이트 매각과 서비스 종료 과정을 거치며 초기 서버의 방대한 회원 인맥 데이터가 완전 소멸하였다." },
    { name: "라이코스 코리아", date: "1999", genre: "포털 서비스", status: "완전 유실", details: "[상세] '검정 개' 광고로 유명했던 포털이다. 한국 시장 철수 후 모든 서비스 데이터와 검색 엔진 인덱스 기록이 영구 폐기되었다." },
    { name: "퀴즈퀴즈 (초기)", date: "1999", genre: "온라인 게임", status: "데이터 유실", details: "[상세] 넥슨의 초기 온라인 게임이다. 큐플레이로 개편되는 과정에서 1999년 당시의 원본 소스 코드와 리소스 상당 부분이 유실되었다." },
    { name: "버디버디", date: "2000", genre: "메신저", status: "완전 유실", details: "[상세] 2000년대 메신저 문화의 상징이다. 서비스 종료와 동시에 수천만 유저의 대화 로그와 '홈피' 데이터가 일괄 삭제되어 복구가 불가능하다." },
    { name: "The $1,000,000 Pyramid", date: "2001", genre: "비디오 게임", status: "완전 소실", details: "[상세] 개발 완료 후 발매 직전 유통사 사정으로 취소되었다. 그 후 개발사의 메인 서버가 물리적으로 파손되어 게임 마스터 데이터가 지구상에서 사라졌다." },
    { name: "야후! 꾸러기", date: "2002", genre: "포털 서비스", status: "일부 유실", details: "[상세] 아이들의 천국이었으나 야후 코리아 철수와 함께 증발했다. 개인이 일부 페이지를 복원하여 아카이빙 중이나, 플래시 게임 데이터의 대다수는 유실된 상태이다." },
    { name: "넷마블 캐치마인드 (초기)", date: "2002", genre: "캐주얼 게임", status: "일부 유실", details: "[상세] 드립의 성지였던 초기 버전이다. 게임이 업데이트되면서 초창기 레전드 유저들이 그렸던 명작 그림 데이터와 구버전 리소스들이 서버에서 삭제되었다." },
    { name: "Crash Village", date: "2003", genre: "온라인 게임", status: "구동 불가", details: "[상세] 2D 횡스크롤 온라인 게임의 초기 형태이다. 운영 중단 후 소스 코드가 관리되지 않아 분실되었으며, 현재는 클라이언트를 실행해도 서버 데이터가 없어 구동이 불가능하다." },
    { name: "컴투스 붕어빵타이쿤 1", date: "2001", genre: "모바일 게임", status: "구동 불가", details: "[상세] 피처폰 게임의 전설이다. 모바일 환경이 스마트폰으로 완전히 전환되는 과정에서 초기 버전의 소스 코드가 유실되어 원본 그대로를 에뮬레이팅하기 어렵다." },
    { name: "플라스틱스 온라인", date: "2003", genre: "RPG", status: "완전 유실", details: "[상세] 독특한 그래픽의 초기 온라인 RPG이다. 개발사 도산 후 서버 하드웨어가 중고로 팔려나가며 그 안에 담긴 모든 유저 기록과 게임 세계관 데이터가 증발했다." },
    { name: "the club", date: "2004", genre: "커뮤니티", status: "데이터 유실", details: "[상세] 싸이월드에 대항했던 초창기 SNS이다. 운영 주체가 바뀌는 과정에서 데이터 이관이 정상적으로 이루어지지 않아 유저들의 방대한 기록이 소실되었다." },
    { name: "파란", date: "2004", genre: "포털 서비스", status: "완전 유실", details: "[상세] 하이텔과 한미르가 통합된 포털이다. 서비스 종료와 동시에 하이텔 시절의 귀중한 PC통신 텍스트 아카이브 상당 부분이 영구 소멸되었다." },
    { name: "CNN Pipeline", date: "2005", genre: "웹 서비스", status: "유실됨", details: "[상세] 인터넷 뉴스 유료화의 초기 실험 모델이다. 서비스가 중단되면서 당시 실시간으로 기록되었던 방대한 동영상 뉴스 아카이브 데이터가 유실되었다." },
    { name: "엠파스", date: "2006", genre: "포털 서비스", status: "완전 유실", details: "[상세] 검색 포털의 강자였다. 네이트와의 통합 이후 엠파스 시절 독자적으로 쌓아온 지식 검색 데이터와 특유의 인덱싱 자료들이 소실되었다." },
    { name: "아비스 대모험", date: "2006", genre: "턴제 RPG", status: "2010년 종료", details: "[상세] 뛰어난 완성도로 기대를 모았으나 2010년 서버 종료 이후 개발팀이 해체되면서 소스 코드와 모든 클라이언트 자산이 유실되었다." }
  ];

  const archiveData = {
    TV: { title: "Lost\nfilms\n& games", icon: "./tv_icon.png", list: tvMediaList },
    Laptop: { title: "Lost\nWeb\n& etc...", icon: "./laptop_icon.png", list: laptopMediaList }
  };

  const currentData = archiveData[selectedFurniture];

  const sortedList = useMemo(() => {
    if (!currentData) return [];
    let list = [...currentData.list];
    if (sortBy === 'year') {
      return list.sort((a, b) => {
        const yearA = parseInt(a.date.match(/\d{4}/)?.[0] || "9999");
        const yearB = parseInt(b.date.match(/\d{4}/)?.[0] || "9999");
        return yearA - yearB;
      });
    } else {
      return list.sort((a, b) => a.genre.localeCompare(b.genre));
    }
  }, [currentData, sortBy]);

  return (
    <div style={{ margin: 0, padding: 0, width: '100vw', height: '100vh', background: '#000', position: 'relative', overflow: 'hidden' }}>
      
      <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <Suspense fallback={null}>
          <Stage intensity={0.5} environment="city" shadows={false}>
            <Room onSelectFurniture={(name) => {
              setSelectedFurniture(name);
              setExpandedIndex(null);
            }} />
          </Stage>
        </Suspense>
        <OrbitControls makeDefault />
      </Canvas>

      {selectedFurniture && currentData && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 1000, overflowY: 'auto', fontFamily: 'OnulDaisy, sans-serif' }}>
          
          <button onClick={() => setSelectedFurniture(null)} style={{ position: 'fixed', top: '30px', right: '40px', background: 'none', border: 'none', fontSize: '30px', cursor: 'pointer', zIndex: 1001, fontFamily: 'OnulDaisy' }}>×</button>

          <div style={{ width: '100%', paddingTop: '60px', paddingLeft: '90px', paddingRight: '90px', paddingBottom: '60px', boxSizing: 'border-box' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '120px' }}>
              <img src={currentData.icon} alt="icon" style={{ height: '180px', width: 'auto', marginRight: '40px' }} />
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '10px 25px', display: 'inline-block', borderRadius: '0' }}>
                <h1 style={{ fontSize: '60px', fontWeight: 'normal', lineHeight: '1.0', margin: 0, whiteSpace: 'pre-wrap', color: '#000', fontFamily: 'OnulDaisy' }}>
                  {currentData.title}
                </h1>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '20px' }}>
              <button onClick={() => setSortBy('year')} style={{ backgroundColor: sortBy === 'year' ? '#ffe200' : '#fff9c4', border: 'none', padding: '6px 20px', fontFamily: 'OnulDaisy', fontSize: '16px', cursor: 'pointer', borderRadius: '0', boxShadow: sortBy === 'year' ? '0 4px 0 #b39e00' : '0 4px 0 #d1c16d', color: '#000' }}>년도순</button>
              <button onClick={() => setSortBy('genre')} style={{ backgroundColor: sortBy === 'genre' ? '#ffe200' : '#fff9c4', border: 'none', padding: '6px 20px', fontFamily: 'OnulDaisy', fontSize: '16px', cursor: 'pointer', borderRadius: '0', boxShadow: sortBy === 'genre' ? '0 4px 0 #b39e00' : '0 4px 0 #d1c16d', color: '#000' }}>장르별</button>
            </div>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sortedList.map((item, index) => (
                <div key={item.name} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div onClick={() => setExpandedIndex(expandedIndex === index ? null : index)} style={{ display: 'flex', backgroundColor: '#f9e6ff', padding: '8px 30px', fontSize: '18px', color: '#000', minHeight: '20px', alignItems: 'center', cursor: 'pointer', fontFamily: 'OnulDaisy' }}>
                    <span style={{ width: '30%', flexShrink: 0 }}>
                      <span style={{ backgroundColor: '#f2afff', padding: '4px 12px', display: 'inline-block', borderRadius: '0' }}>
                        {item.name}
                      </span>
                    </span>
                    <span style={{ width: '20%', flexShrink: 0 }}>{item.date}</span>
                    <span style={{ width: '20%', flexShrink: 0 }}>{item.genre}</span>
                    <span style={{ width: '30%', flexShrink: 0, color: item.status === "완전 소실" ? "red" : "inherit" }}>
                      {item.status}
                    </span>
                  </div>

                  {expandedIndex === index && item.details && (
                    <div style={{ backgroundColor: '#fdf2ff', padding: '25px 40px', fontSize: '16px', color: '#444', borderTop: '1px solid #f2d1ff', fontFamily: 'OnulDaisy', lineHeight: '1.7', whiteSpace: 'pre-wrap', textAlign: 'center' }}>
                      {item.details}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App