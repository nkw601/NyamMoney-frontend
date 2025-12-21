<template>
  <Layout>
    <div>
      <h1 class="text-2xl font-bold mb-6">챌린지 테스트</h1>

      <!-- 헤더 영역 -->
      <div class="flex justify-between items-center mb-6">
        <button
          @click="goCreate"
          class="inline-flex items-center
                 px-3 py-1.5
                 text-sm font-medium
                 rounded-full
                 border border-red-500
                 bg-yummoney-primary text-black
                 hover:bg-yummoney-primaryHover
                 transition">
          + 챌린지 생성
        </button>
      </div>
  
      <!-- 로딩 -->
      <p v-if="loading">불러오는 중...</p>
  
      <!-- 컨텐츠 -->
      <div v-else>
        <!-- 참여한 챌린지 -->
        <div v-if="joinedChallenges.length" class="mb-10">
          <h2 class="text-lg font-semibold mb-4">참여한 챌린지</h2>
  
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="c in joinedChallenges"
              :key="c.challengeId"
              class="rounded-xl border bg-white p-5 shadow-sm
                     hover:-translate-y-1 transition cursor-pointer"
              :class="statusStyleMap[c.status]?.border"
              @click="goDetail(c.challengeId)"
              >
              <!-- 🔹 상단 뱃지 영역 -->
              <div class="flex items-center gap-2 mb-2">
                  <!-- 상태 뱃지 -->
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="statusStyleMap[c.status]?.badge"
                  >
                    {{ statusStyleMap[c.status]?.label }}
                  </span>
  
                  <!-- 참여 여부 뱃지 -->
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full
                          bg-green-100 text-green-700"
                  >
                    참여한 챌린지
                  </span>
              </div>
  
              <h2 class="font-semibold text-lg mb-2">{{ c.title }}</h2>
  
              <p class="text-sm text-gray-600 mb-4 line-clamp-2">
                {{ c.description }}
              </p>
  
              <p class="text-xs text-gray-500 mb-2">
                {{ c.startDate }} ~ {{ c.endDate }}
              </p>
  
              <div class="flex justify-between items-center mt-4">
                <span class="text-sm text-gray-500">
                  참여자 {{ c.participantCount ?? 0 }}명
                </span>
              </div>
            </div>
          </div>
        </div>
  
        <!-- 미참여 챌린지 -->
        <div v-if="notJoinedChallenges.length">
          <h2 class="text-lg font-semibold mb-4">미참여 챌린지</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="c in notJoinedChallenges"
              :key="c.challengeId"
              class="rounded-xl border bg-white p-5 shadow-sm
                     hover:-translate-y-1 transition cursor-pointer"
              :class="statusStyleMap[c.status]?.border"
              @click="goDetail(c.challengeId)"
            >
              <!-- 🔹 상단 뱃지 영역 -->
              <div class="flex items-center gap-2 mb-2">
                  <!-- 상태 뱃지 -->
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="statusStyleMap[c.status]?.badge"
                  >
                    {{ statusStyleMap[c.status]?.label }}
                  </span>
  
                  <!-- 미참여 여부 뱃지 -->
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full
                          bg-green-100 text-green-700"
                  >
                    미참여 챌린지
                  </span>
  
              </div>
  
              <h2 class="font-semibold text-lg mb-2">{{ c.title }}</h2>
  
              <p class="text-sm text-gray-600 mb-4 line-clamp-2">
                {{ c.description }}
              </p>
  
              <p class="text-xs text-gray-500 mb-2">
                {{ c.startDate }} ~ {{ c.endDate }}
              </p>
  
              <div class="flex justify-between items-center mt-4">
                <span class="text-sm text-gray-500">
                  참여자 {{ c.participantCount ?? 0 }}명
                </span>
              </div>
            </div>
          </div>
        </div>


        
      </div>
    </div>
  </Layout>
</template>

<script>
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useChallengeStore } from '@/stores/challenge.store'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()
    const challengeStore = useChallengeStore()
    const { challenges, loading } = storeToRefs(challengeStore)

    const statusStyleMap = {
      UPCOMING: {
        badge: 'bg-blue-100 text-blue-700',
        border: 'hover:border-blue-400',
        label: '곧 시작',
      },
      ACTIVE: {
        badge: 'bg-green-100 text-green-700',
        border: 'hover:border-green-500',
        label: '진행 중',
      },
      ENDED: {
        badge: 'bg-gray-100 text-gray-500',
        border: 'hover:border-gray-300',
        label: '종료됨',
      },
      CLOSED: {
        badge: 'bg-gray-100 text-gray-500',
        border: 'border-gray-200',
        label: '취소됨',
      },
    }

    onMounted(async () => {
      await challengeStore.loadChallenges()
      console.log('값 잘 넘어오나 확인', challenges.value)
      console.log('joinedChallenges:', joinedChallenges.value)
      console.log('notJoinedChallenges:', notJoinedChallenges.value)

    })

    const goDetail = (challengeId) => {
      router.push({
        name: 'challengeDetail',
        params: { challengeId },
      })
    }

    const goCreate = () => {
      router.push({ name: 'challengeCreate' })
    }

    const joinedChallenges = computed(() =>
      challenges.value.filter(c => c.joined)
    )

    const notJoinedChallenges = computed(() =>
      challenges.value.filter(c => !c.joined)
    )

    return {
      loading,
      statusStyleMap,
      goDetail,
      goCreate,
      joinedChallenges,
      notJoinedChallenges,
    }
  },
}
</script>
